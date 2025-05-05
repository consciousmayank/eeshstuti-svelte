import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create deities
    const ganesha = await prisma.deity.create({
      data: {
        name: 'Lord Ganesha',
        description: 'Remover of Obstacles, God of New Beginnings',
      }
    });

    const lakshmi = await prisma.deity.create({
      data: {
        name: 'Goddess Lakshmi',
        description: 'Goddess of Wealth, Fortune and Prosperity',
      }
    });

    const krishna = await prisma.deity.create({
      data: {
        name: 'Lord Krishna',
        description: 'God of Compassion, Tenderness and Love',
      }
    });

    // Add images
    await prisma.image.create({
      data: {
        url: 'https://images.unsplash.com/photo-1567591414240-e9c0cc916440?q=80&w=1000&auto=format&fit=crop',
        description: 'Lord Ganesha statue',
        deityId: ganesha.id
      }
    });

    await prisma.image.create({
      data: {
        url: 'https://images.unsplash.com/photo-1618767451283-1e3ae0343b1c?q=80&w=1000&auto=format&fit=crop',
        description: 'Goddess Lakshmi image',
        deityId: lakshmi.id
      }
    });

    await prisma.image.create({
      data: {
        url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1000&auto=format&fit=crop',
        description: 'Lord Krishna statue',
        deityId: krishna.id
      }
    });

    // Add prayers
    await prisma.prayer.create({
      data: {
        name: 'Ganesh Stotram',
        content: `Shuklām Baradharam Vishnum Shashi Varnam Chaturbhujam
Prasanna Vadanam Dhyāyet Sarva Vighnopa Shāntaye
Vakratunda Mahākāya Sūryakoti Samaprabha
Nirvighnam Kuru Me Deva Sarva-Kāryeshu Sarvadā`,
        type: 'stotram',
        translation: 'O Lord Ganesha, with a curved trunk, large body, and the brilliance of a million suns, please make all my works free of obstacles, always.',
        deityId: ganesha.id
      }
    });

    await prisma.prayer.create({
      data: {
        name: 'Lakshmi Stotram',
        content: `Namaste'stu Mahāmāye Śrīpīṭhe Sura-pūjite
Śaṅkha-Padma-gadā-haste Mahālakṣmi Namo'stu te`,
        type: 'stotram',
        translation: 'I bow to the great illusion, Goddess Lakshmi, who is seated on a throne, worshipped by the gods, and who holds a conch, lotus, and mace in her hands.',
        deityId: lakshmi.id
      }
    });

    await prisma.prayer.create({
      data: {
        name: 'Krishna Ashtakam',
        content: `Vasudeva Sutam Devam Kansa Chānūra Mardanam
Devakī Paramānandam Krishnam Vande Jagadgurum`,
        type: 'ashtakam',
        translation: 'I bow to Krishna, the son of Vasudeva, the destroyer of Kansa and Chanura, the supreme bliss of Devaki, and the teacher of the universe.',
        deityId: krishna.id
      }
    });

    // Add stories
    await prisma.story.create({
      data: {
        title: 'How Ganesha Got His Elephant Head',
        content: `Once, Goddess Parvati created Ganesha from the sandalwood paste that she used for her bath and breathed life into him. She then assigned him the task of guarding her door while she bathed. Lord Shiva, who had gone out, returned and was stopped by Ganesha from entering. Shiva, unaware that this was his son, became enraged and severed Ganesha's head. When Parvati learned of this, she was devastated and insisted that Shiva restore Ganesha to life. Shiva, realizing his mistake, agreed to bring Ganesha back to life with the head of the first living creature he came across, which happened to be an elephant.`,
        deityId: ganesha.id
      }
    });

    // Create occasions
    const diwali = await prisma.occasion.create({
      data: {
        name: 'Diwali',
        description: 'Festival of Lights',
        story: 'Diwali celebrates the return of Lord Rama to Ayodhya after defeating Ravana.',
        date: 'October/November'
      }
    });

    // Create junction entries
    await prisma.occasionDeity.create({
      data: {
        occasionId: diwali.id,
        deityId: ganesha.id
      }
    });

    await prisma.occasionDeity.create({
      data: {
        occasionId: diwali.id,
        deityId: lakshmi.id
      }
    });

    console.log('Database has been seeded!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 