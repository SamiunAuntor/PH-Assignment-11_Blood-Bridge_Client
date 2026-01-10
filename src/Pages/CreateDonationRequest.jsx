import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";

const CreateDonationRequest = () => {
    const axios = useAxios();
    const { register, handleSubmit, watch, reset, setValue } = useForm();
    const { user, loading } = useAuth();

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    // Pre-fill requester info + default date & time
    useEffect(() => {
        if (user) {
            setValue("requesterName", user.displayName || "");
            setValue("requesterEmail", user.email || "");
            setValue("donationDate", today);
            setValue("donationTime", currentTime);
        }
    }, [user, setValue, today, currentTime]);

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
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Donation request created successfully",
                timer: 3000,
                showConfirmButton: false,
            });

            reset({
                requesterName: user.displayName || "",
                requesterEmail: user.email || "",
                recipientName: "",
                bloodGroup: "",
                division: "",
                district: "",
                upazila: "",
                donationDate: today,
                donationTime: currentTime,
                hospitalName: "",
                address: "",
                message: ""
            });

        } catch {
            Swal.fire("Error", "Failed to create donation request", "error");
        }
    };

    return (
        <div className="px-4 md:px-12 py-6">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-6">
                Create Donation Request 🩸✏️
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
                        {...register("requesterName", { required: true })}
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
                        {...register("requesterEmail", { required: true })}
                    />
                </div>

                {/* Recipient Name */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">
                        Recipient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="e.g. John Wick"
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
                        <select className="px-4 py-3 border-2 border-red-300 rounded-md w-full"
                            {...register("division", { required: true })}>
                            <option value="">Select Division</option>
                            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
                            {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
                            {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
                        min={today}
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
                        placeholder="e.g. Dhaka Medical College Hospital"
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
                        placeholder="e.g. Zahir Raihan Road, Dhaka"
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
                        placeholder="Optional message for donors"
                        className="px-4 py-3 border-2 border-red-300 rounded-md w-full resize-none"
                        {...register("message")}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                >
                    {loading ? "Checking login..." : "Create Request"}
                </button>

            </form>
        </div>
    );
};

export default CreateDonationRequest;
