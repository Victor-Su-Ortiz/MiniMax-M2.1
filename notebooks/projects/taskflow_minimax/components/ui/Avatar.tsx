import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export function Avatar({ src, name, className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-full ring-2 ring-slate-800", className)}>
        <Image
          src={src}
          alt={name}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs ring-2 ring-slate-800",
      className
    )}>
      {initials}
    </div>
  );
}