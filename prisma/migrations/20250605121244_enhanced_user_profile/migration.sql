-- CreateEnum
CREATE TYPE "CoachingMode" AS ENUM ('Online', 'Offline', 'Both');

-- CreateEnum
CREATE TYPE "StudyLevel" AS ENUM ('School', 'College', 'Competitive', 'Professional');

-- CreateEnum
CREATE TYPE "BatchSizePreference" AS ENUM ('Individual', 'Small', 'Medium', 'Large');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "batchSize" "BatchSizePreference",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "budgetRange" TEXT,
ADD COLUMN     "coachingMode" "CoachingMode",
ADD COLUMN     "devicePreference" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "internetSpeed" TEXT,
ADD COLUMN     "learningGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxTravelDistance" TEXT,
ADD COLUMN     "onlineClassFormat" TEXT,
ADD COLUMN     "preferredCities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredSubjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sessionTimings" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "studyLevel" "StudyLevel",
ADD COLUMN     "targetExams" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "transportMode" TEXT;
