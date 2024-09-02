<template>
    <div class="flex h-screen w-screen bg-slate-200">
        <div class="w-1/2 p-4">
            <div class="flex">
                <div class="w-1/3 h-1/3 p-2">
                    <div class="flex items-end mb-20">
                        <div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <!-- <div class="p-1"> -->
                <div class="bg-white p-7 rounded-xl shadow-lg h-4/5 w-3/5">
                    <div>
                        <h3 class="mb-10">
                            <span class="text-gray-700 text-lg font-sans">Welcome </span>
                            <!-- <span class="text-gray-800 font-semibold text-lg font-sans">CRM</span> -->
                        </h3>
                    </div>
                    <div>
                        <h4 class="text-4xl font-bold mb-4 font-sans">Sign in</h4>
                    </div>
                    <!-- <spam class="text-gray-070 text-lg font-sans mt-8">Empowering your financial experience</spam> -->
                    <div class="py-4 mt-1">
                        <div class="mt-1">
                            <input v-model="email" type="email" id="email" name="email" placeholder="Enter Username"
                                class="mt-1 h-14 p-2 w-full border rounded-md" />
                        </div>
                        <div class="mt-4">
                            <div class="mb-4 relative">
                                <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
                                    name="password" placeholder="Password"
                                    class="mt-1 h-14 p-2 pr-10 w-full border rounded-md" />

                                <!-- Eye button for show/hide password -->
                                <button @click="togglePasswordVisibility"
                                    class="absolute inset-y-0 right-0 flex items-center pr-2 focus:outline-none">
                                    <i v-if="showPassword" class="pi pi-eye-slash text-gray-400"></i>
                                    <i v-else class="pi pi-eye text-gray-400"></i>
                                </button>
                            </div>
                        </div>
                        <div class="w-full flex mt-7">
                            <button type="button"
                                class="w-full h-14 text-white bg-blue-900 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none  dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                                :loading="loading" @click="load">Login</button>
                        </div>
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
        <div class="relative w-1/2 p-4 rounded-lg overflow-hidden">
            <!-- Image container -->
            <div class="h-full rounded-xl overflow-hidden">
                <img src="../../assets/dms_image.jpg" alt="Image" class="object-cover w-full h-full rounded-lg">
            </div>
            <!-- Gradient overlay -->
            <div class="absolute bottom-5 left-4 right-5 top-12 rounded-lg"
                style="background: linear-gradient(to bottom, rgba(252, 251, 251, 0), rgba(10, 10, 10, 0.808));">
            </div>

            <!-- Heading and Subheading -->
            <div class="absolute bottom-11 left-12 right-0 p-10 text-white">
                <h3 class="text-3xl font-extrabold mb-2 font-sans">Sign in to your account</h3>
                <!-- <span class="text-lg font-semibol  d font-sans">Your Gateway to Empowered Banking<br> Operations</span> -->
            </div>
        </div>

    </div>
    <Toast />
</template>

<script>
import { constant } from '@/constants/constants';

export default {
    data() {
        return {
            loading: false,
            email: '',
            password: '',
            showPassword: false
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        load() {
            this.loading = true;
            if (this.email && this.password === constant.commonUserPass) {
                localStorage.setItem("userName", this.email);
                if (this.email === constant.adminUserName) {
                    localStorage.setItem("role", "admin");
                } else {
                    localStorage.setItem("role", "user");
                    localStorage.setItem("userName",this.email)
                }
                this.$router.push("/translanding");
                // axios.post("/user/loginAPI", payload, {})
                //   .then((res) => {
                //     console.log("---------------------local token--------", res);
                //     localStorage.setItem("api-token", res.data.token);
                //     console.log("---------------------local token--------", localStorage.getItem("api-token"));
                //     this.$router.push("/");
                //   })
                //   .catch((err) => {
                //     console.log(err.message);
                //   });
            } else {
                this.$toast.add({ severity: "error", detail: "Invalid Credentials", life: 2000 });
            }
        }
    },
    created() {

    }
};
</script>

<style></style>