import Image from 'next/image';

interface FilmPosterProps {
  posterPath?: string;
  title: string;
  size?: 'small' | 'medium';
}

export function FilmPoster({ posterPath, title, size = 'small' }: FilmPosterProps) {
  const dimensions = size === 'small' ? { width: 40, height: 60 } : { width: 80, height: 120 };

  if (!posterPath) {
    return (
      <div
        className="bg-gray-200 rounded flex items-center justify-center text-gray-400"
        style={dimensions}
      >
        <span className="text-xs">No poster</span>
      </div>
    );
  }

  return (
    <Image
      src={`/api/Images/${encodeURIComponent(posterPath)}`}
      alt={`${title} poster`}
      width={dimensions.width}
      height={dimensions.height}
      className="rounded object-cover"
    />
  );
}
