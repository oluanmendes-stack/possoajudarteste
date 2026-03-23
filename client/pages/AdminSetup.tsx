import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSetup() {
  const { registerAdminUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    try {
      await registerAdminUser();
      toast.success("Admin user created successfully!");
      toast.info("Login with matrícula: 1234, senha: 12345678901");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating admin user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
        <p className="text-gray-600 mb-4">
          Click the button below to create the admin user
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Matrícula: 1234<br />
          Senha: 12345678901
        </p>
        <Button
          onClick={handleCreateAdmin}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isLoading ? "Creating..." : "Create Admin User"}
        </Button>
      </div>
    </div>
  );
}
