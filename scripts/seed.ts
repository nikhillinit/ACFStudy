import { db } from "../server/db";
import { modules } from "../shared/schema";

async function seedModules() {
  const moduleData = [
    {
      id: 'time-value-money',
      title: 'Time Value of Money',
      description: 'Master present value, future value, and annuity calculations',
      category: 'Foundation',
      difficulty: 1,
      estimatedTime: 90
    },
    {
      id: 'portfolio-theory',
      title: 'Portfolio Theory & Risk',
      description: 'Learn risk, return, and diversification principles',
      category: 'Investments',
      difficulty: 2,
      estimatedTime: 75
    },
    {
      id: 'bond-valuation',
      title: 'Bond Valuation',
      description: 'Understand bond pricing and yield calculations',
      category: 'Fixed Income',
      difficulty: 2,
      estimatedTime: 85
    },
    {
      id: 'financial-statements',
      title: 'Financial Statement Analysis',
      description: 'Analyze balance sheets and income statements',
      category: 'Analysis',
      difficulty: 1,
      estimatedTime: 95
    },
    {
      id: 'capital-budgeting',
      title: 'Capital Budgeting',
      description: 'Master NPV, IRR, and investment decisions',
      category: 'Corporate Finance',
      difficulty: 3,
      estimatedTime: 100
    }
  ];

  try {
    for (const module of moduleData) {
      await db.insert(modules).values(module).onConflictDoNothing();
    }
    console.log('✅ Modules seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding modules:', error);
  }
}

seedModules().catch(console.error);