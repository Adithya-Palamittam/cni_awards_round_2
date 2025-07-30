
interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ value, onChange, label, size = 'md' }: StarRatingProps) => {
  const starSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl';
  const labelWidth = size === 'sm' ? 'w-16' : 'w-20';

  return (
    <div className="flex items-center justify-between mb-6">
      <span className={`text-lg font-medium text-left ${labelWidth}`}>{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`${starSize} ${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
