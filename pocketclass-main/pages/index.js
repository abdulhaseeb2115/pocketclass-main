import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LargeCard from "../components/LargeCard";
import MediumCard from "../components/MediumCard";
import SmallCard from "../components/SmallCard";
import styles from "../styles/Home.module.css";
import { db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

export default function Home({ exploreData, cardsData }) {
  return (
    <div className="">
      <Head>
        <title>pocketclass</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>
      {/* header */}
      <Header />
      {/* banner */}
      <Banner />

      <main className="max-w-7xl mx-auto px-8 py-8 sm:px-16">
        <section>
          <h2 className="text-4xl font-semibold py-5">
            Explore Classes Nearby
          </h2>
          {/* APIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {exploreData?.map(
              ({
                id,
                type,
                latitude,
                name,
                images,
                description,
                longitude,
                ratings,
                address,
              }) => (

                <SmallCard
                  key={id}
                  img={images[0]}
                  type={type}
                  description={description}
                />

              )
            )}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-semibold py-8 pb-5">Learn Anything</h2>
          <div className="flex space-x-3 overflow-scroll scrollbar-hide p-3">
            {cardsData?.map(
              ({
                id,
                type,
                latitude,
                name,
                images,
                description,
                longitude,
                ratings,
                address,
              }) => (
                <MediumCard
                  key={id}
                  img={images[0]}
                  title={name}
                />
              )
            )}
          </div>
        </section>

        <section>
          <LargeCard
            img="https://links.papareact.com/4cj"
            title="Become an Instructor"
            description="Teach your Passion"
            buttonText="I'm Interested"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  var exploreData = [];
  var cardsData = [];

  const q = query(collection(db, "classes"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var dataObj = {
      id: doc.id,
      type: doc.data().type,
      latitude: doc.data().latitude,
      name: doc.data().name,
      images: doc.data().images,
      description: doc.data().description,
      longitude: doc.data().longitude,
      ratings: doc.data().ratings,
      address: doc.data().address,
    };
    exploreData.push(dataObj);
    cardsData.push(dataObj);
  });

  return {
    props: {
      exploreData,
      cardsData,
    },
  };
}