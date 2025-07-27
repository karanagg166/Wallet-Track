// prisma/seedExistingUserTransactions.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('✨ Starting to generate dummy transactions for existing user...');

  try {
    const existingUserEmail = 'ayush@gmail.com';
    const ayushUser = await prisma.user.findUnique({
      where: { email: existingUserEmail },
      select: { id: true, name: true }, // Select only necessary fields
    });

    if (!ayushUser) {
      console.error(`❌ Error: User with email "${existingUserEmail}" not found. Please ensure the user exists before running this seed script.`);
      process.exit(1);
    }
    console.log(`✅ Found existing user: ${ayushUser.name} (ID: ${ayushUser.id})`);

    // Fetch existing categories for this user
    const ayushCategories = await prisma.category.findMany({
      where: { userId: ayushUser.id },
    });

    if (ayushCategories.length === 0) {
      console.warn(`⚠️ Warning: No categories found for user "${ayushUser.name}". Please create some categories first, or this script will not be able to link expenses.`);
      process.exit(1); // Exit if no categories to link expenses to
    }
    console.log(`✅ Found ${ayushCategories.length} categories for ${ayushUser.name}.`);

    // Define available payment methods based on your UI
    const paymentMethods = ['Cash', 'Card', 'UPI', 'e-RUPI', 'Netbanking', 'Other'];

    // Define common income sources
    const incomeSources = ['Salary', 'Freelance Income', 'Investment Return', 'Gift', 'Bonus', 'Rental Income'];

    // Filter categories into expense and income types based on keywords
    const expenseCategories = ayushCategories.filter(c =>
      !['Salary', 'Investment', 'Freelance', 'Gift', 'Bonus', 'Rental'].some(incomeKeyword => c.name.toLowerCase().includes(incomeKeyword.toLowerCase()))
    );

    const incomeSpecificCategories = ayushCategories.filter(c =>
      ['Salary', 'Investment', 'Freelance', 'Gift', 'Bonus', 'Rental'].some(incomeKeyword => c.name.toLowerCase().includes(incomeKeyword.toLowerCase()))
    );


    // --- Generate Dummy Expenses ---
    const numberOfExpensesToGenerate = 20; // Adjust as needed
    let expensesCreated = 0;

    if (expenseCategories.length > 0) {
      console.log(`🚀 Generating ${numberOfExpensesToGenerate} expenses...`);
      for (let i = 0; i < numberOfExpensesToGenerate; i++) {
        const randomCategory = faker.helpers.arrayElement(expenseCategories);
        const expenseDate = faker.date.recent({ days: 2 }); // Expenses over the last 2 years (approx)

        await prisma.expense.create({
          data: {
            userId: ayushUser.id,
            amount: faker.number.int({ min: 50, max: 10000 }), // Amount in smallest currency unit (e.g., paise, cents)
            title: faker.commerce.productName(), // More realistic titles
            paymentmethod: faker.helpers.arrayElement(paymentMethods),
            expenseAt: expenseDate,
            categoryId: randomCategory.id,
          },
        });
        expensesCreated++;
      }
      console.log(`🎉 Successfully added ${expensesCreated} new expenses for ${ayushUser.name}.`);
    } else {
      console.warn(`⚠️ No suitable expense categories found for ${ayushUser.name}. Skipping expense generation.`);
    }

    // --- Generate Dummy Incomes ---
    const numberOfIncomesToGenerate = 50; // Adjust as needed
    let incomesCreated = 0;

    console.log(`💰 Generating ${numberOfIncomesToGenerate} incomes...`);
    for (let i = 0; i < numberOfIncomesToGenerate; i++) {
      const incomeDate = faker.date.recent({ days: 365 * 2 }); // Incomes over the last 2 years (approx)

      await prisma.income.create({
        data: {
          userId: ayushUser.id,
          amount: faker.number.int({ min: 5000, max: 200000 }), // Larger amounts for income
          title: faker.finance.transactionDescription(), // More descriptive titles for income
          incomesource: faker.helpers.arrayElement(incomeSources),
          incomeAt: incomeDate,
        },
      });
      incomesCreated++;
    }
    console.log(`🎊 Successfully added ${incomesCreated} new incomes for ${ayushUser.name}.`);

    console.log('✅ Dummy data generation finished successfully!');

  } catch (e) {
    console.error('❌ An error occurred during dummy data generation:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();