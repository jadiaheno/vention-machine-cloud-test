interface RatingProps {
  rating?: number;
  setRating: (rating: number) => void;
}

export const Rating: React.FC<RatingProps> = ({ rating = 0, setRating }) => {
  return (
    <div className="m-3 flex flex-row items-center gap-2">
      <Star onSelected={() => setRating(1)} selected={rating >= 1} />
      <Star onSelected={() => setRating(2)} selected={rating >= 2} />
      <Star onSelected={() => setRating(3)} selected={rating >= 3} />
      <Star onSelected={() => setRating(4)} selected={rating >= 4} />
      <Star onSelected={() => setRating(5)} selected={rating >= 5} />
    </div>
  );
};

interface StarProps {
  selected: boolean;
  onSelected?: () => void;
  height?: number;
  width?: number;
}
const Star: React.FC<StarProps> = ({
  selected,
  onSelected,
  height = 48,
  width = 48,
}) => {
  return (
    <svg
      fill="none"
      height={height}
      onClick={onSelected}
      viewBox="0 0 50 50"
      width={width}
      className="hover:scale-125 hover:bg-white/20"
    >
      <path
        d="M42.7282 18.6173C42.5125 17.9534 41.8985 17.5074 41.2005 17.5074H29.8251L26.3099 6.68877C26.0942 6.02491 25.4803 5.57886 24.7823 5.57886C24.0842 5.57886 23.4703 6.02491 23.2547 6.68873L19.7395 17.5074H8.36408C7.66599 17.5074 7.05202 17.9534 6.83631 18.6173C6.62064 19.2811 6.85514 20.0027 7.41977 20.4129L16.6229 27.0993L13.1077 37.9179C12.8919 38.5818 13.1264 39.3036 13.6912 39.7139C13.9735 39.9191 14.3043 40.0216 14.6352 40.0216C14.966 40.0216 15.2969 39.919 15.5791 39.7139L24.7823 33.0275L33.9853 39.7139C34.5499 40.1241 35.3087 40.1242 35.8734 39.7139C36.4381 39.3036 36.6726 38.5818 36.4569 37.918L32.9417 27.0993L42.1448 20.4129C42.7094 20.0027 42.9439 19.2811 42.7282 18.6173Z"
        fill={selected ? "#EBBB4D" : "#999999"}
        fillOpacity={selected ? 1 : 0.5}
      />
    </svg>
  );
};
