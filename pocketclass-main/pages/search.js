import { useRouter } from "next/router";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { format } from "date-fns";
import InfoCard from "../components/InfoCard";
import Mapper from "../components/Mapper";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

function Search({ searchResults }) {
    const router = useRouter();
    const { searchInput, startDate, endDate, noOfGuests } = router.query;
    const formattedStartDate = format(new Date(startDate), "dd MMMM yy");
    const formattedEndDate = format(new Date(endDate), "dd MMMM yy");
    const range = `${formattedStartDate} to ${formattedEndDate}`;
    return (
        <div>
            <Header placeholder={`${searchInput} | ${range} | ${noOfGuests} guests`} />

            <main className="flex">
                <section className="flex-grow pt-14 px-6">
                    <p className="text-xs text-gray-500">
                        300+ Classes | {range} - for {noOfGuests} student(s)
                    </p>
                    <h1 className="text-3xl font-semibold mt-2 mb-6">
                        "{searchInput}" Classes
                    </h1>

                    <div className="hidden md:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
                        <p className="button">Class categories</p>
                        <p className="button">Price</p>
                        <p className="button">More filters</p>
                    </div>

                    <div className="flex flex-col">
                        {searchResults?.map(
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
                                <InfoCard
                                    key={id} // should have an id
                                    type={type}
                                    latitude={latitude}
                                    name={name}
                                    images={images}
                                    description={description}
                                    longitude={longitude}
                                    ratings={ratings}
                                    address={address}
                                />
                            )
                        )}
                    </div>
                </section>

                <section className="hidden xl:inline-flex xl:min-w-[600px]">
                    <Mapper />
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Search;

export async function getServerSideProps(context) {
    const { searchInput } = context.query;
    var searchResults = [];

    const q = query(
        collection(db, "classes"),
        where("name", "==", searchInput),
    );

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
        searchResults.push(dataObj);
    });

    return {
        props: {
            searchResults,
        },
    };
}
