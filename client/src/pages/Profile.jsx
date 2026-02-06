import { useState } from "react";
import { User, Mail, MapPin, Phone, Camera } from "lucide-react";
import { Container } from "../components/layout";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../components/common";

function Profile() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  if (isLoading) return <PageLoader />;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary font-medium hover:underline"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input pl-10 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input pl-10 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Add phone number"
                        className="input pl-10 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Add address"
                        className="input pl-10 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
