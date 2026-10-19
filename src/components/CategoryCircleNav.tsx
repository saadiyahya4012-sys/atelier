import React from 'react';

interface CategoryCircleNavProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryCircleNav: React.FC<CategoryCircleNavProps> = ({
  currentCategory,
  onSelectCategory
}) => {
  const categories = [
    {
      label: 'Femme',
      value: 'femme',
      image: '/src/assets/images/cat_femme_model_1792324523689.jpg',
      alt: 'Collection Femme ATELIER'
    },
    {
      label: 'Homme',
      value: 'homme',
      image: '/src/assets/images/cat_homme_model_1792324525142.jpg',
      alt: 'Collection Homme ATELIER'
    },
    {
      label: 'Accessoires',
      value: 'accessoires',
      image: '/src/assets/images/cat_accessoires_bag_1792324525828.jpg',
      alt: 'Maroquinerie & Accessoires ATELIER'
    },
    {
      label: 'Nouveautés',
      value: 'nouveautes',
      image: '/src/assets/images/cat_nouveautes_fabric_1792324525877.jpg',
      alt: 'Nouveautés & Matières Nobles ATELIER'
    }
  ];

  return (
    <section className="bg-[#FAF8F5] border-b border-[#E8E4DC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#7A746B] block">
            Explorer par Univers
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#141414] tracking-tight mt-1">
            Les Univers de l'Atelier
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  const el = document.getElementById('catalogue-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex flex-col items-center cursor-pointer transition-all focus:outline-hidden"
              >
                {/* Circular Image Container */}
                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden p-1 transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? 'ring-2 ring-[#141414] ring-offset-2 ring-offset-[#FAF8F5]'
                      : 'border border-[#DDD7CC] hover:border-[#141414]'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full filter brightness-[0.98] transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Category Label */}
                <span
                  className={`mt-3.5 text-xs sm:text-sm font-medium tracking-[0.16em] uppercase transition-colors ${
                    isActive ? 'text-[#141414] font-semibold' : 'text-[#59554E] group-hover:text-[#141414]'
                  }`}
                >
                  {cat.label}
                </span>

                {/* Subtle indicator bar */}
                <span
                  className={`block mt-1 h-[1.5px] transition-all duration-300 ${
                    isActive ? 'w-6 bg-[#141414]' : 'w-0 group-hover:w-4 bg-[#8E887E]'
                  }`}
                />
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
