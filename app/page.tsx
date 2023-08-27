import { Metadata, ResolvingMetadata } from 'next';

import dayjs from 'dayjs';

import Footer from '../components/Footer';
import BirthSongContainer from '../components/main/BirthSongContainer';

import { metadata } from './layout';

import styles from './index.module.scss';

type Props = {
  searchParams: { [key: string]: string | undefined; };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  const date = searchParams?.date;

  if (!date) {
    return metadata;
  }

  const previousImages = (await parent)?.openGraph?.images || [];

  const description = `${dayjs(date).format('YYYY년 MM월 DD일')} 1위 노래는?`;

  return {
    title: metadata.title,
    description,
    openGraph: {
      title: metadata.title,
      images: previousImages,
      description,
      url: `${process.env.NEXT_PUBLIC_ORIGIN}?date=${date}`,
    },
    twitter: {
      title: metadata.title,
      description,
    },
  };
}

function Home({ searchParams }: Props) {
  return (
    <>
      <main className={styles.mainWrapper}>
        <h1 className={styles.title}>
          {'+-------------------+\n¦      내 생일      ¦\n¦   1위 노래 찾기   ¦\n+-------------------+'}
        </h1>
        <BirthSongContainer defaultBirthDate={searchParams?.date} />
      </main>
      <Footer />
    </>
  );
}

export default Home;
