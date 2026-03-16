import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">

            <Navbar />

            {/* HERO SECTION */}
            <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
                <h1 className="text-4xl font-bold sm:text-5xl">
                    Find Affordable Rooms & Roommates Near Your College
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
                    EasyRoom helps students find shared rooms or roommates without paying
                    expensive PG rent. Post rooms, search listings, and connect with
                    classmates looking for housing.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                        to="/register"
                        className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-indigo-500"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-md border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100 dark:border-white/30 dark:hover:bg-white/10"
                    >
                        Login
                    </Link>
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section className="mx-auto max-w-6xl px-6 py-16">
                <h2 className="text-center text-3xl font-bold">The Problem</h2>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold text-lg">Expensive PGs</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Many PG accommodations charge very high rent which is difficult
                            for students to afford.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold text-lg">Hard to Find Roommates</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Students moving to a new city often struggle to find people to
                            share rooms with.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold text-lg">Agent Fees</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Agents charge unnecessary commission and make housing even more
                            expensive.
                        </p>
                    </div>
                </div>
            </section>

            {/* SOLUTION SECTION */}
            <section className="mx-auto max-w-6xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold">Our Solution</h2>

                <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                    EasyRoom connects students who are leaving their rooms with students
                    who are searching for affordable accommodation.
                </p>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl bg-indigo-500/20 p-6">
                        <h3 className="font-semibold text-lg">Post a Room</h3>
                        <p className="mt-2 text-sm">
                            Students leaving their room can post availability for others.
                        </p>
                    </div>

                    <div className="rounded-xl bg-indigo-500/20 p-6">
                        <h3 className="font-semibold text-lg">Search Listings</h3>
                        <p className="mt-2 text-sm">
                            Students looking for rooms can search listings easily.
                        </p>
                    </div>

                    <div className="rounded-xl bg-indigo-500/20 p-6">
                        <h3 className="font-semibold text-lg">Find Roommates</h3>
                        <p className="mt-2 text-sm">
                            Connect with other students who want to share rent.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="mx-auto max-w-6xl px-6 py-16">
                <h2 className="text-center text-3xl font-bold">Platform Features</h2>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold">Room Listings</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Students can post available rooms with rent, location and details.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold">Requirement Matching</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Save your room requirements and get notified when a matching room
                            appears.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold">Roommate Matching</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Find students who want to share a room based on preferences.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/20 p-6 shadow">
                        <h3 className="font-semibold">Admin Moderation</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Admin removes agent listings to keep the platform safe for
                            students.
                        </p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="mx-auto max-w-6xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold">How It Works</h2>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="font-semibold text-lg">1. Register</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Create your student account in seconds.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">2. Post or Search</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Post your room or search for available rooms.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">3. Connect</h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Contact the student directly and finalize the room.
                        </p>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="mx-auto max-w-4xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold">About EasyRoom</h2>

                <p className="mt-6 text-slate-700 dark:text-slate-300">
                    EasyRoom was created to solve the housing problems faced by students
                    moving to new cities for education. Our mission is to make room
                    sharing simple, affordable, and safe by connecting students directly
                    without agents.
                </p>
            </section>

            {/* CONTACT SECTION */}
            <section className="mx-auto max-w-3xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold">Contact Us</h2>

                <p className="mt-4 text-slate-700 dark:text-slate-300">
                    Have questions or suggestions? Send us a message.
                </p>

                <form className="mt-8 flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        className="rounded-md border border-slate-300 px-4 py-3 dark:bg-slate-900"
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        className="rounded-md border border-slate-300 px-4 py-3 dark:bg-slate-900"
                    />

                    <textarea
                        placeholder="Your Message"
                        rows="4"
                        className="rounded-md border border-slate-300 px-4 py-3 dark:bg-slate-900"
                    />

                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
                    >
                        Send Message
                    </button>
                </form>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm dark:border-white/10">
                © {new Date().getFullYear()} EasyRoom. Built for students.
            </footer>

        </div>
    );
}