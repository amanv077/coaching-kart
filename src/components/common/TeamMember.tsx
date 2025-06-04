import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-utils';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMember = ({ name, role, image, bio }: TeamMemberProps) => (
  <div className="group">
    <div className="aspect-square relative overflow-hidden rounded-2xl mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-coaching-primary/10 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-6">
          <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {bio}
          </p>
        </div>
      </div>
      <Image 
        src={getImageUrl(image)} 
        alt={name}
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        fill
      />
    </div>
    <h4 className="text-xl font-bold">{name}</h4>
    <p className="text-coaching-primary text-sm">{role}</p>
  </div>
);

export default TeamMember;