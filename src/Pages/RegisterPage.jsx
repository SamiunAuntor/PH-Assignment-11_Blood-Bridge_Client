import React, { useEffect, useState } from "react";
import registerImage from "../assets/loginPhoto.jpg";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { uploadImageToImgBB } from "../Utilities/UploadImage";

const RegisterPage = () => {
    const { registerUserWithEmailPassword } = useAuth();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    // Load JSON files
    useEffect(() => {
        fetch("/divisions.json").then(res => res.json()).then(setDivisions);
        fetch("/districts.json").then(res => res.json()).then(setDistricts);
        fetch("/upzillas.json").then(res => res.json()).then(setUpazilas);
    }, []);

    const filteredDistricts = districts.filter(d => d.division_id === selectedDivision);
    const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

    const handleRegister = async (data) => {
        const { email, password, name, bloodGroup, district, upazila } = data;

        try {
            const { user } = await registerUserWithEmailPassword(email, password);

            // Upload avatar asynchronously
            let avatarURL = "";
            if (avatarFile) {
                toast.loading("Uploading avatar...", { id: "avatarUpload" });
                avatarURL = await uploadImageToImgBB(avatarFile);
                toast.dismiss("avatarUpload");
            }

            // Update Firebase user profile
            await updateProfile(user, {
                displayName: name,
                photoURL: avatarURL || null,
            });

            toast.success(`Welcome, ${name}!`, {
                duration: 3000,
                position: 'top-center',
                style: {
                    padding: '16px 24px',
                    fontSize: '16px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 'bold',
                },
            });

            reset();
            setAvatarFile(null);

            // Redirect after short delay
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            toast.error(err.message, { position: 'top-center' });
        }
    };

    return (
        <div className="my-0 flex flex-col md:flex-row">

            {/* Image */}
            <div className="w-full md:w-7/10 h-64 md:h-auto hidden md:block">
                <img src={registerImage} alt="Register" className="w-full h-full object-contain" />
            </div>

            {/* Form */}
            <div className="w-full md:w-3/10 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">Register</h2>

                    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-4">

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        {/* Avatar */}
                        <div>
                            <label className="text-sm font-medium">Choose Avatar (optional)</label>
                            <input
                                type="file"
                                className="block w-full mt-2 file-input file-input-bordered border-2 border-red-300 text-gray-600 rounded-md cursor-pointer"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                            />
                        </div>

                        {/* Blood Group */}
                        <select
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("bloodGroup", { required: "Blood group is required" })}
                        >
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                        {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>}

                        {/* Division */}
                        <select
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("division", { required: "Division is required" })}
                        >
                            <option value="">Select Division</option>
                            {divisions.map(div => (
                                <option key={div.id} value={div.id}>{div.name}</option>
                            ))}
                        </select>
                        {errors.division && <p className="text-red-500 text-sm">{errors.division.message}</p>}

                        {/* District */}
                        <select
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("district", { required: "District is required" })}
                            disabled={!selectedDivision}
                        >
                            <option value="">Select District</option>
                            {filteredDistricts.map(dist => (
                                <option key={dist.id} value={dist.id}>{dist.name}</option>
                            ))}
                        </select>

                        {/* Upazila */}
                        <select
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("upazila", { required: "Upazila is required" })}
                            disabled={!selectedDistrict}
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map(upa => (
                                <option key={upa.id} value={upa.id}>{upa.name}</option>
                            ))}
                        </select>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                className="px-4 py-3 w-full border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            >
                                {showPass ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="px-4 py-3 w-full border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                                {...register("confirmPassword", {
                                    required: "Confirm your password",
                                    validate: (value, formValues) =>
                                        value === formValues.password || "Passwords do not match"
                                })}
                            />
                            <span
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            >
                                {showConfirmPass ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                        >
                            Register
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-red-600 font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Toaster for toast messages */}
            <Toaster />
        </div>
    );
};

export default RegisterPage;
