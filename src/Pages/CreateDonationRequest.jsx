import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../Hooks/useAxios";
import { showToast } from "../Utilities/ToastMessage";
import useAuth from "../Hooks/useAuth";

const CreateDonationRequest = () => {
    const axios = useAxios();
    const { register, handleSubmit, watch, reset, setValue } = useForm();
    const { user, loading } = useAuth();

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    // Pre-fill requester info when user loads
    useEffect(() => {
        if (user) {
            setValue("requesterName", user.displayName || "");
            setValue("requesterEmail", user.email || "");
        }
    }, [user, setValue]);

    // Fetch divisions/districts/upazilas
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const [divRes, distRes, upaRes] = await Promise.all([
                    fetch("/divisions.json"),
                    fetch("/districts.json"),
                    fetch("/upzillas.json"),
                ]);

                const divisionsData = await divRes.json();
                const districtsData = await distRes.json();
                const upazilasData = await upaRes.json();

                setDivisions(divisionsData);
                setDistricts(districtsData);
                setUpazilas(upazilasData);
            } catch (err) {
                console.error(err);
                showToast("Failed to load location data", "error");
            }
        };

        fetchLocationData();
    }, []);

    const filteredDistricts = districts.filter(
        (d) => String(d.division_id) === String(selectedDivision)
    );

    const filteredUpazilas = upazilas.filter(
        (u) => String(u.district_id) === String(selectedDistrict)
    );

    const onSubmit = async (data) => {
        if (loading) {
            showToast("Checking login status...", "info");
            return;
        }

        if (!user) {
            showToast("Unauthorized: Please log in", "error");
            return;
        }

        try {
            const idToken = await user.getIdToken();

            await axios.post(
                "/dashboard/create-donation-request",
                {
                    requesterName: data.requesterName,
                    requesterEmail: data.requesterEmail,
                    recipientName: data.recipientName,
                    recipientDistrict: data.district,
                    recipientUpazila: data.upazila,
                    hospitalName: data.hospitalName,
                    address: data.address,
                    bloodGroup: data.bloodGroup,
                    donationDate: data.donationDate,
                    donationTime: data.donationTime,
                    message: data.message || "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            showToast("Donation request created successfully", "success");

            // Reset form but keep the read-only values
            reset({
                requesterName: user.displayName || "",
                requesterEmail: user.email || "",
                recipientName: "",
                bloodGroup: "",
                division: "",
                district: "",
                upazila: "",
                donationDate: "",
                donationTime: "",
                hospitalName: "",
                address: "",
                message: ""
            });

        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                showToast("Unauthorized: Please log in", "error");
            } else {
                showToast("Failed to create donation request", "error");
            }
        }
    };

    return (
        <div className="px-4 md:px-12 py-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6 md:text-4xl">
                Create Donation Request
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Requester Name (read-only) */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">Requester Name</label>
                    <input
                        type="text"
                        placeholder="Requester Name"
                        className="px-4 py-3 border-2 border-gray-300 rounded-md outline-none bg-gray-100 cursor-not-allowed"
                        {...register("requesterName", { required: true })}
                        readOnly
                    />
                </div>

                {/* Requester Email (read-only) */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">Requester Email</label>
                    <input
                        type="email"
                        placeholder="Requester Email"
                        className="px-4 py-3 border-2 border-gray-300 rounded-md outline-none bg-gray-100 cursor-not-allowed"
                        {...register("requesterEmail", { required: true })}
                        readOnly
                    />
                </div>


                {/* Recipient Name */}
                <input
                    type="text"
                    placeholder="Recipient Name (Mr. John Wick)"
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                    {...register("recipientName", { required: true })}
                />

                {/* Blood Group */}
                <select
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                    {...register("bloodGroup", { required: true })}
                >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>
                            {bg}
                        </option>
                    ))}
                </select>

                {/* Division / District / Upazila */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                        {...register("division", { required: true })}
                    >
                        <option value="">Select Division</option>
                        {divisions.map((div) => (
                            <option key={div.id} value={div.id}>
                                {div.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                        {...register("district", { required: true })}
                        disabled={!selectedDivision}
                    >
                        <option value="">Select District</option>
                        {filteredDistricts.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                                {dist.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                        {...register("upazila", { required: true })}
                        disabled={!selectedDistrict}
                    >
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map((upa) => (
                            <option key={upa.id} value={upa.id}>
                                {upa.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date | Time */}
                <input
                    type="date"
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none cursor-pointer"
                    {...register("donationDate", { required: true })}
                />
                <input
                    type="time"
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none cursor-pointer"
                    {...register("donationTime", { required: true })}
                />

                {/* Hospital Name */}
                <input
                    type="text"
                    placeholder="Hospital Name (ABC Hospital)"
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none md:col-span-2"
                    {...register("hospitalName", { required: true })}
                />

                {/* Hospital Address */}
                <textarea
                    placeholder="Hospital Address (Zahir Raihan Rd, Dhaka)"
                    rows={2}
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none resize-none md:col-span-2"
                    {...register("address", { required: true })}
                />

                {/* Additional Message */}
                <textarea
                    placeholder="Why do you need the blood? (optional)"
                    rows={2}
                    className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none resize-none md:col-span-2"
                    {...register("message")}
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 md:col-span-2"
                    disabled={loading}
                >
                    {loading ? "Checking login..." : "Create Request"}
                </button>
            </form>
        </div>
    );
};

export default CreateDonationRequest;