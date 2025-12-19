import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import useAxios from "../Hooks/useAxios";
import { showToast } from "../Utilities/ToastMessage";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

const EditDonationRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axios = useAxios();
    const { register, handleSubmit, watch, reset, setValue } = useForm();
    const { user, loading } = useAuth();
    const [requestLoading, setRequestLoading] = useState(true);

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    // Fetch the donation request
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setRequestLoading(true);
                const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();
                const res = await axios.get(`/dashboard/donation-request/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const req = res.data.request;
                // Find division from district
                const districtObj = districts.find(d => String(d.id) === String(req.recipientDistrict));
                const divisionId = districtObj?.division_id;

                // Set form values
                setValue("requesterName", req.requesterName);
                setValue("requesterEmail", req.requesterEmail);
                setValue("recipientName", req.recipientName);
                setValue("division", divisionId || "");
                setValue("district", req.recipientDistrict);
                setValue("upazila", req.recipientUpazila);
                setValue("hospitalName", req.hospitalName);
                setValue("address", req.address);
                setValue("bloodGroup", req.bloodGroup);
                setValue("donationDate", req.donationDate);
                setValue("donationTime", req.donationTime);
                setValue("message", req.message || "");
            } catch (err) {
                console.error("Failed to fetch request:", err);
                Swal.fire("Error", "Failed to load donation request", "error");
                navigate("/dashboard/my-donation-requests");
            } finally {
                setRequestLoading(false);
            }
        };

        if (id && districts.length > 0) {
            fetchRequest();
        }
    }, [id, districts, axios, navigate, setValue]);

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

            await axios.put(
                `/dashboard/donation-request/${id}`,
                {
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

            Swal.fire("Success", "Donation request updated successfully", "success");
            navigate("/dashboard/my-donation-requests");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update donation request", "error");
        }
    };

    if (requestLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-red-600 mb-6">Edit Donation Request</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
                    {/* Requester Info (Read Only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Requester Name
                            </label>
                            <input
                                {...register("requesterName")}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Requester Email
                            </label>
                            <input
                                {...register("requesterEmail")}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Recipient Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipient Name *
                        </label>
                        <input
                            {...register("recipientName", { required: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Division
                            </label>
                            <select
                                {...register("division")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Select Division</option>
                                {divisions.map((div) => (
                                    <option key={div.id} value={div.id}>
                                        {div.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                District *
                            </label>
                            <select
                                {...register("district", { required: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Select District</option>
                                {filteredDistricts.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upazila *
                            </label>
                            <select
                                {...register("upazila", { required: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                disabled={!selectedDistrict}
                            >
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Hospital Info */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hospital Name *
                        </label>
                        <input
                            {...register("hospitalName", { required: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="e.g., Dhaka Medical College Hospital"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Address *
                        </label>
                        <input
                            {...register("address", { required: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="e.g., Zahir Raihan Rd, Dhaka"
                        />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Blood Group *
                        </label>
                        <select
                            {...register("bloodGroup", { required: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Donation Date *
                            </label>
                            <input
                                type="date"
                                {...register("donationDate", { required: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Donation Time *
                            </label>
                            <input
                                type="time"
                                {...register("donationTime", { required: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Request Message
                        </label>
                        <textarea
                            {...register("message")}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="Why do you need blood? (Details)"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/my-donation-requests")}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Donation Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDonationRequest;


