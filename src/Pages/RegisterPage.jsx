import React, { useEffect, useState } from "react";
import registerImage from "../assets/loginPhoto.jpg";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { uploadImageToImgBB } from "../Utilities/UploadImage";
import { showToast } from "../Utilities/ToastMessage";
import Loading from "../Components/Loading";
import useAxios from "../Hooks/useAxios";

const RegisterPage = () => {
    const axios = useAxios();
    const [registering, setRegistering] = useState(false);
    const { registerUserWithEmailPassword, loading } = useAuth();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");

    // Ensure minimum loading time
    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch location data
    useEffect(() => {
        fetch("/divisions.json").then(res => res.json()).then(setDivisions);
        fetch("/districts.json").then(res => res.json()).then(setDistricts);
        fetch("/upzillas.json").then(res => res.json()).then(setUpazilas);
    }, []);

    const filteredDistricts = districts.filter(d => d.division_id === selectedDivision);
    const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

    const handleRegister = async (data) => {
        const { email, password, name } = data;

        try {
            setRegistering(true); // show loading overlay
            const { user } = await registerUserWithEmailPassword(email, password);

            let avatarURL = null;

            // Upload avatar if exists
            if (avatarFile) {
                avatarURL = await uploadImageToImgBB(avatarFile);
            }

            // Update Firebase profile
            await updateProfile(user, {
                displayName: name,
                photoURL: avatarURL || null,
            });

            // Update backend database
            await axios.post("/register-user", {
                name,
                email,
                bloodGroup: data.bloodGroup,
                division: data.division,
                district: data.district,
                upazila: data.upazila,
                avatar: avatarURL || null,
            });

            showToast(`Welcome, ${name}! Registration successful.`, "success");
            reset();
            navigate("/"); // Navigate after everything is done

        } catch (err) {
            if (err.message.includes("email-already-in-use")) {
                showToast("This email is already registered. Please login.", "error");
            } else {
                showToast("Registration failed. Please try again.", "error");
                console.error(err);
            }
        } finally {
            setRegistering(false); // hide loading overlay
        }
    };


    // Early return for loading
    if (pageLoading || formLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loading />
            </div>
        );
    }


    return (
        <div className="my-0 flex flex-col md:flex-row">
            <div className="w-full md:w-7/10 h-64 md:h-auto hidden md:block relative">
                <img src={registerImage} alt="Register" className="w-full h-full object-contain" />
                {registering && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <p className="text-white text-xl font-bold animate-pulse">Registering...</p>
                    </div>
                )}
            </div>


            <div className="w-full md:w-3/10 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">Register</h2>

                    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-4">

                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        <input
                            type="text"
                            placeholder="Full Name"
                            className="px-4 py-3 border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        <div>
                            <label className="text-sm font-medium">Choose Avatar (optional)</label>
                            <input
                                type="file"
                                className="block w-full mt-2 file-input file-input-bordered border-2 border-red-300 text-gray-600 rounded-md cursor-pointer"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                            />
                        </div>

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
                        {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}

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
                        {errors.upazila && <p className="text-red-500 text-sm">{errors.upazila.message}</p>}

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
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                            >
                                {showPass ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                            </span>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

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
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                            >
                                {showConfirmPass ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                            </span>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

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
        </div>
    );
};

export default RegisterPage;
