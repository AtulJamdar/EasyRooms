import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);

    (async () => {
      try {
        const res = await api.get("/auth/profile");
        const user = res.data.user || {};
        setUserData(user);

        reset({
          ...user,
          lifestyleHabits: (user.lifestyleHabits || []).join(", "),
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token, reset]);

  const onSubmit = async (data) => {
    try {
      setSuccess(false);

      const { email, ...rest } = data;

      const payload = {
        ...rest,
        lifestyleHabits: Array.isArray(rest.lifestyleHabits)
          ? rest.lifestyleHabits
          : rest.lifestyleHabits
              ?.split(",")
              .map((item) => item.trim())
              .filter(Boolean) || [],
      };

      await api.put("/auth/profile", payload);

      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const logout = () => {
    clearToken();
    setAuthToken(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="rounded-xl bg-rose-800/60 p-8">
          <h2 className="text-xl font-semibold">Error</h2>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={logout}
            className="mt-4 rounded-md bg-indigo-500 px-4 py-2"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your Profile</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Manage your personal details
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="rounded-md bg-indigo-500 px-4 py-2 text-white"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>

            <button
              onClick={logout}
              className="rounded-md bg-slate-800/70 px-4 py-2 text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* PROFILE HEADER */}
        <div className="mt-8 flex items-center gap-4 rounded-xl bg-white/80 p-4 shadow dark:bg-slate-900/40">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
            {userData?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{userData?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {userData?.email}
            </p>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="mt-4 text-green-500 text-sm text-center">
            Profile updated successfully
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 rounded-2xl bg-white/80 p-8 shadow dark:bg-slate-900/40"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* NAME */}
            <div>
              <label className="text-sm">Name</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm">Email</label>
              <input
                disabled
                className="mt-1 w-full rounded-md border px-3 py-2 bg-slate-200 dark:bg-slate-800 cursor-not-allowed"
                {...register("email")}
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm">Phone</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("phone")}
              />
            </div>

            {/* COLLEGE */}
            <div>
              <label className="text-sm">College</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("college")}
              />
            </div>

            {/* COURSE */}
            <div>
              <label className="text-sm">Course</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("course")}
              />
            </div>

            {/* YEAR */}
            <div>
              <label className="text-sm">Year</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("year")}
              />
            </div>

            {/* BUDGET */}
            <div>
              <label className="text-sm">Budget</label>
              <input
                type="number"
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("budget", { valueAsNumber: true })}
              />
            </div>

            {/* HABITS */}
            <div className="md:col-span-2">
              <label className="text-sm">Lifestyle habits</label>
              <input
                disabled={!editMode}
                className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-950"
                {...register("lifestyleHabits")}
              />
            </div>
          </div>

          {editMode && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-indigo-500 px-4 py-2 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}