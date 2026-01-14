import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage, uploadMultipleImages } from '@/backend/cloud-image-upload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!userExists) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const formData = await request.formData();
    
    // Extract form fields
    const organizationName = formData.get('organizationName') as string;
    const businessType = formData.get('businessType') as string;
    const gstNumber = formData.get('gstNumber') as string;
    const panNumber = formData.get('panNumber') as string;
    
    // Profile details
    const profileName = formData.get('profileName') as string;
    const branchName = formData.get('branchName') as string;
    const establishedYear = parseInt(formData.get('establishedYear') as string);
    const tagline = formData.get('tagline') as string;
    const description = formData.get('description') as string;
    
    // Location details
    const address = formData.get('address') as string;
    const landmark = formData.get('landmark') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const pincode = formData.get('pincode') as string;
    
    // Contact details
    const contactNumber = formData.get('contactNumber') as string;
    const alternateNumber = formData.get('alternateNumber') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;
    
    // Social media
    const facebookUrl = formData.get('facebookUrl') as string;
    const instagramUrl = formData.get('instagramUrl') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const twitterUrl = formData.get('twitterUrl') as string;
    
    // Operating details
    const operatingDays = JSON.parse(formData.get('operatingDays') as string || '[]');
    const operatingHours = (formData.get("operatingHours") as string) || "";
    const facilities = JSON.parse(
      (formData.get("facilities") as string) || "[]"
    );
    // Academic details
    const subjectsOffered = JSON.parse(
      (formData.get("subjectsOffered") as string) || "[]"
    );
    const examsOffered = JSON.parse(
      (formData.get("examsOffered") as string) || "[]"
    );

    // Handle teachers data
    const teachers: any[] = [];
    let teacherIndex = 0;

    while (formData.get(`teacher_${teacherIndex}`)) {
      const teacherData = JSON.parse(
        formData.get(`teacher_${teacherIndex}`) as string
      );
      const teacherImageFile = formData.get(
        `teacher_image_${teacherIndex}`
      ) as File;

      let teacherImageUrl = "";
      if (teacherImageFile && teacherImageFile.size > 0) {
        const teacherImageResult = await uploadImage(
          teacherImageFile,
          "teacher-images",
          5 * 1024 * 1024,
          true
        );
        teacherImageUrl = teacherImageResult.url;
      }

      teachers.push({
        ...teacherData,
        profileImage: teacherImageUrl,
        experience: parseInt(teacherData.experience) || 0,
      });
      teacherIndex++;
    }

    // Validate required fields
    if (
      !organizationName ||
      !profileName ||
      !description ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !contactNumber ||
      !email
    ) {
      console.log("Missing required fields for coaching creation");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Form validation passed, starting file uploads...");

    // Handle file uploads with cloud storage
    const logoFile = formData.get("logo") as File;
    let logoUrl = "";

    if (logoFile && logoFile.size > 0) {
      console.log("Uploading logo...");
      const logoResult = await uploadImage(
        logoFile,
        "logos",
        5 * 1024 * 1024,
        true
      ); // Use cloud storage
      console.log("Logo uploaded:", logoResult.url);
      logoUrl = logoResult.url;
    }

    // Handle teacher images
    const teacherImages: { [key: number]: string } = {};
    let teacherImgIndex = 0;

    while (formData.get(`teacher_image_${teacherImgIndex}`)) {
      const teacherImageFile = formData.get(
        `teacher_image_${teacherImgIndex}`
      ) as File;
      if (teacherImageFile && teacherImageFile.size > 0) {
        console.log(`Uploading teacher image ${teacherImgIndex}...`);
        const uploadResults = await uploadMultipleImages(
          [teacherImageFile],
          "teacher-images",
          2 * 1024 * 1024,
          true
        ); // 2MB limit
        if (uploadResults.length > 0) {
          teacherImages[teacherImgIndex] = uploadResults[0].url;
        }
        console.log(`Teacher image ${teacherImgIndex} uploaded`);
      }
      teacherImgIndex++;
    }

    // Handle multiple images
    const imageFiles: File[] = [];
    let imageIndex = 0;

    while (formData.get(`image_${imageIndex}`)) {
      const imageFile = formData.get(`image_${imageIndex}`) as File;
      if (imageFile && imageFile.size > 0) {
        imageFiles.push(imageFile);
      }
      imageIndex++;
    }

    console.log(`Uploading ${imageFiles.length} coaching images...`);
    const imageResults =
      imageFiles.length > 0
        ? await uploadMultipleImages(
            imageFiles,
            "coaching-images",
            5 * 1024 * 1024,
            true
          ) // Use cloud storage
        : [];
    console.log("Coaching images uploaded");
    const imageUrls = imageResults.map((result) => result.url);

    // Create coaching and profile in a transaction
    console.log("Starting DB transaction...");
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the main coaching organization
      console.log("Creating coaching record...");
      const coaching = await tx.coaching.create({
        data: {
          organizationName,
          ownerName: session.user.name || "",
          ownerEmail: session.user.email || "",
          ownerPhone: contactNumber,
          businessType: businessType as any,
          gstNumber: gstNumber || null,
          panNumber: panNumber || null,
          ownerUserId: session.user.id,
        },
      }); // Create the coaching profile (branch)
      const profile = await tx.coachingProfile.create({
        data: {
          name: profileName,
          branchName: branchName || null,
          establishedYear,
          tagline: tagline || null,
          description,
          logo: logoUrl || null,
          images: imageUrls,

          // Location details
          address,
          landmark: landmark || null,
          city,
          state,
          pincode,

          // Contact details
          contactNumber,
          alternateNumber: alternateNumber || null,
          email,
          website: website || null,

          // Social media
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          youtubeUrl: youtubeUrl || null,
          twitterUrl: twitterUrl || null,

          // Operating details
          operatingDays,
          operatingHours,
          facilities,

          // Academic details
          subjectsOffered,
          examsOffered,

          // Relations
          coaching: {
            connect: {
              id: coaching.id,
            },
          },
        },
      }); // Create teachers
      const createdTeachers = [];
      for (let i = 0; i < teachers.length; i++) {
        const teacher = teachers[i];
        const teacherImageUrl = teacherImages[i] || null;

        const createdTeacher = await tx.teacher.create({
          data: {
            name: teacher.name,
            qualification: teacher.qualification,
            specialization: teacher.subjects || [],
            experience: parseInt(teacher.experience) || 0,
            profileImage: teacherImageUrl,
            bio: teacher.description || null,
            profileId: profile.id,
          },
        });
        createdTeachers.push(createdTeacher);
      }

      return { coaching, profile, teachers: createdTeachers };
    });    return NextResponse.json({
      message: 'Coaching created successfully',
      coaching: result.coaching,
      profile: result.profile,
      teachers: result.teachers,
    });
  } catch (error) {
    console.error('Error creating coaching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
