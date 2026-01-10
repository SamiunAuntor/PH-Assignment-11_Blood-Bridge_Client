import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

const EditDonationRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axios = useAxios();
    const { register, handleSubmit, watch, setValue } = useForm();
    const { user, loading } = useAuth();
    const [requestLoading, setRequestLoading] = useState(true);

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    // Fetch location data
    useEffect(() => {
        Promise.all([
            fetch("/divisions.json").then(res => res.json()),
            fetch("/districts.json").then(res => res.json()),
            fetch("/upzillas.json").then(res => res.json()),
        ])
            .then(([div, dist, upa]) => {
                setDivisions(div);
                setDistricts(dist);
                setUpazilas(upa);
            })
            .catch(() => {
                Swal.fire("Error", "Failed to load location data", "error");
            });
    }, []);

    // Fetch donation request
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setRequestLoading(true);
                const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();

                const res = await axios.get(
                    `/dashboard/donation-request/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const req = res.data.request;

                const districtObj = districts.find(
                    d => String(d.id) === String(req.recipientDistrict)
                );

                const divisionId = districtObj?.division_id;

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
            } catch {
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

    // Prefill requester info
    useEffect(() => {
        if (user) {
            setValue("requesterName", user.displayName || "");
            setValue("requesterEmail", user.email || "");
        }
    }, [user, setValue]);

    const filteredDistricts = districts.filter(
        d => String(d.division_id) === String(selectedDivision)
    );

    const filteredUpazilas = upazilas.filter(
        u => String(u.district_id) === String(selectedDistrict)
    );

    const onSubmit = async (data) => {
        if (!user) {
            Swal.fire("Unauthorized", "Please log in first", "error");
            return;
        }

        try {
            const token = await user.getIdToken();

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
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire("Success", "Donation request updated successfully", "success");
            navigate("/dashboard/my-donation-requests");
        } catch {
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
        <div className="px-4 md:px-12 py-6">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-6">
                Edit Donation Request 🩸✏️
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Requester Name */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Requester Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        readOnly
                        className="px-4 py-3 border-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed w-full"
                        {...register("requesterName")}
                    />
                </div>

                {/* Requester Email */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Requester Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        readOnly
                        className="px-4 py-3 border-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed w-full"
                        {...register("requesterEmail")}
                    />
                </div>

                {/* Recipient Name */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Recipient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                        {...register("recipientName", { required: true })}
                    />
                </div>

                {/* Blood Group */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                        {...register("bloodGroup", { required: true })}
                    >
                        <option value="">Select Blood Group</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Division <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                            {...register("division")}
                        >
                            <option value="">Select Division</option>
                            {divisions.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            District <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled={!selectedDivision}
                            className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                            {...register("district", { required: true })}
                        >
                            <option value="">Select District</option>
                            {filteredDistricts.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Upazila <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled={!selectedDistrict}
                            className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                            {...register("upazila", { required: true })}
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Donation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                        {...register("donationDate", { required: true })}
                    />
                </div>

                {/* Time */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Donation Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                        {...register("donationTime", { required: true })}
                    />
                </div>

                {/* Hospital */}
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">
                        Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                        {...register("hospitalName", { required: true })}
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">
                        Hospital Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={2}
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full resize-none"
                        {...register("address", { required: true })}
                    />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">
                        Additional Message
                    </label>
                    <textarea
                        rows={2}
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full resize-none"
                        {...register("message")}
                    />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/my-donation-requests")}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Request"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditDonationRequest;
