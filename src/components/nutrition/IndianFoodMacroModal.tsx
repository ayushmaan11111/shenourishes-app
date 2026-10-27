import React, { useState } from 'react';
import { Search, X, Utensils, Sparkles, Plus } from 'lucide-react';
import { INDIAN_FOOD_CATALOG, IndianFoodItem } from '../../data/indianFoodCatalog';
import { MacronutrientEducationDiagram } from './MacronutrientEducationDiagram';

interface IndianFoodMacroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood?: (food: IndianFoodItem) => void;
}

export const IndianFoodMacroModal: React.FC<IndianFoodMacroModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('All');
  const [selectedDiet, setSelectedDiet] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [showMacroGuide, setShowMacroGuide] = useState(true);

  if (!isOpen) return null;

  const filteredFoods = INDIAN_FOOD_CATALOG.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedDiet !== 'All' && item.dietType !== selectedDiet) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || item.servingSize.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          backgroundColor: '#FFFDF8',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid #D9D8CC',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color="#E8CA56" />
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Indian Food, Macronutrient & Calorie Catalog
              </h2>
            </div>
            <p style={{ fontSize: '11.5px', color: '#C8D6EC', margin: '2px 0 0' }}>
              180+ Authentic Veg & Non-Veg Dishes with precise macro breakdown (Carbs, Protein, Fat, Total kcal)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ padding: '14px 20px', backgroundColor: '#FAF8F0', borderBottom: '1px solid #EAE6D4' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={15} color="#8A9568" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search 180+ dishes (e.g. Poha, Palak Paneer, Chicken Curry, Samosa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: '8px',
                  border: '1.5px solid #D9D8CC',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Diet Filter */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['All', 'Veg', 'Non-Veg'] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setSelectedDiet(diet)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: selectedDiet === diet ? '1.5px solid #0A1C44' : '1px solid #D9D8CC',
                    backgroundColor: selectedDiet === diet ? (diet === 'Veg' ? '#EEF4E8' : diet === 'Non-Veg' ? '#FDF0EE' : '#0A1C44') : '#FFFFFF',
                    color: selectedDiet === diet ? (diet === 'All' ? '#FFFFFF' : '#0A1C44') : '#6B7063',
                    cursor: 'pointer',
                  }}
                >
                  {diet === 'Veg' ? '🥬 Veg Only' : diet === 'Non-Veg' ? '🍗 Non-Veg' : 'All Diets'}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Category Filters */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? '#66734A' : '#EAE6D4',
                  color: selectedCategory === cat ? '#FFFDF8' : '#6B7063',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowMacroGuide(!showMacroGuide)}
              style={{
                marginLeft: 'auto',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: '#FAF6D9',
                color: '#6B5418',
                border: '1px solid #E8DEB2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              <span>{showMacroGuide ? 'Hide Macro Rules' : 'Show Macro Rules'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Macronutrients & Calories Educational Diagram */}
          {showMacroGuide && (
            <MacronutrientEducationDiagram
              dietType={selectedDiet === 'Veg' ? 'VEGETARIAN' : selectedDiet === 'Non-Veg' ? 'NON-VEGETARIAN' : 'VEGETARIAN'}
            />
          )}

          {/* Foods Results Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7063' }}>
              Showing {filteredFoods.length} Indian food items
            </span>
          </div>

          {/* Foods Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${food.dietType === 'Veg' ? '#B8D4A8' : '#F5C6CB'}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        backgroundColor: food.dietType === 'Veg' ? '#EEF4E8' : '#FDF0EE',
                        color: food.dietType === 'Veg' ? '#38571A' : '#C85A48',
                      }}
                    >
                      {food.dietType === 'Veg' ? '🥬 100% VEG' : '🍗 NON-VEG'}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#6B7063', fontWeight: 600 }}>
                      {food.category}
                    </span>
                  </div>

                  {/* Food Name & Serving */}
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#242820', margin: '0 0 2px' }}>
                    {food.name}
                  </h4>
                  <div style={{ fontSize: '11px', color: '#6B7063', marginBottom: '10px' }}>
                    Serving: <strong>{food.servingSize}</strong>
                  </div>

                  {/* Macro Badges */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ padding: '4px', backgroundColor: '#F8F6EF', borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#6B7063', fontWeight: 700 }}>CALORIES</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#242820' }}>{food.calories}</div>
                    </div>
                    <div style={{ padding: '4px', backgroundColor: '#EEF4E8', borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#38571A', fontWeight: 700 }}>PROTEIN</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#38571A' }}>{food.proteinGrams}g</div>
                    </div>
                    <div style={{ padding: '4px', backgroundColor: '#E3F2FD', borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#1565C0', fontWeight: 700 }}>CARB</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#1565C0' }}>{food.carbsGrams}g</div>
                    </div>
                    <div style={{ padding: '4px', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#E65100', fontWeight: 700 }}>FAT</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#E65100' }}>{food.fatGrams}g</div>
                    </div>
                  </div>
                </div>

                {/* Optional Action Button */}
                {onSelectFood && (
                  <button
                    type="button"
                    onClick={() => onSelectFood(food)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: '#66734A',
                      color: '#FFFDF8',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={13} />
                    <span>Log to Daily Intake</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', backgroundColor: '#FAF8F0', borderTop: '1px solid #D9D8CC', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '12.5px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
