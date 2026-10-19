import React from 'react';

interface LogoProps {
  className?: string;
}

export const VisaLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto' }) => (
  <svg
    viewBox="19 27 82 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Visa"
  >
    <title>Visa</title>
    {/* Yellow detail on tip of the V */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.1709 27.1625L19.0476 27.5966C19.0476 27.5966 22.2782 28.2669 26.057 30.5326L30.8 30.5326L29.7324 27.1625H19.1709Z"
      fill="#F7B600"
    />
    {/* Blue letters (V, I, S, A) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.3113 27.1625L35.9217 44.8213L35.1663 41.0185L35.167 41.0199L32.9114 29.4749C32.9114 29.4749 32.6394 27.1625 29.7324 27.1625H26.057L31.8793 52.8375H38.8617L49.5238 27.1625H42.3113Z"
      fill="#1434CB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.6517 52.8375H47.6191L52.0144 27.1625H59.0477L54.6517 52.8375Z"
      fill="#1434CB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M77.1866 33.5711L78.0952 28.244C78.0952 28.244 75.2896 27.1625 72.3648 27.1625C69.2031 27.1625 61.6955 28.5638 61.6955 35.3738C61.6955 41.7825 70.5071 41.8621 70.5071 45.2266C70.5071 48.5912 62.6034 47.9901 59.9955 45.8676L59.0476 51.4362C59.0476 51.4362 61.8919 52.8375 66.2397 52.8375C70.5869 52.8375 77.1467 50.5544 77.1467 44.3455C77.1467 37.8964 68.2552 37.296 68.2552 34.4921C68.2552 31.6882 74.4602 32.0484 77.1866 33.5711Z"
      fill="#1434CB"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M86.6666 44.9375L90.3239 35.0625L92.3809 44.9375H86.6666ZM100.952 52.8375L95.8086 27.1625H88.7383C86.3525 27.1625 85.7723 29.0759 85.7723 29.0759L76.1904 52.8375H82.8868L84.2269 49.0244H92.3947L93.1479 52.8375H100.952Z"
      fill="#1434CB"
    />
  </svg>
);

export const MastercardLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto' }) => (
  <svg
    viewBox="21.7 16.3 76.6 47.4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Mastercard"
  >
    <title>Mastercard</title>
    {/* Overlapping translucent middle */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M49.6521 58.595H70.3479V21.4044H49.6521V58.595Z"
      fill="#FF5F00"
    />
    {/* Yellow/Orange Right circle */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M98.2675 40.0003C98.2675 53.063 87.6791 63.652 74.6171 63.652C69.0996 63.652 64.0229 61.7624 60 58.5956C65.5011 54.2646 69.0339 47.5448 69.0339 40.0003C69.0339 32.4552 65.5011 25.7354 60 21.4044C64.0229 18.2376 69.0996 16.348 74.6171 16.348C87.6791 16.348 98.2675 26.937 98.2675 40.0003Z"
      fill="#F79E1B"
    />
    {/* Red Left circle */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50.966 40.0003C50.966 32.4552 54.4988 25.7354 59.9999 21.4044C55.977 18.2376 50.9003 16.348 45.3828 16.348C32.3208 16.348 21.7324 26.937 21.7324 40.0003C21.7324 53.063 32.3208 63.652 45.3828 63.652C50.9003 63.652 55.977 61.7624 59.9999 58.5956C54.4988 54.2646 50.966 47.5448 50.966 40.0003Z"
      fill="#EB001B"
    />
  </svg>
);
