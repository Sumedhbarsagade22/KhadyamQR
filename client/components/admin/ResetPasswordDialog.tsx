import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ResetPasswordDialogProps {
  email: string;
  onSuccess?: () => void;
  children: React.ReactNode;
}

const validatePassword = (
  password: string,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("One lowercase letter (a-z)");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter (A-Z)");
  }
  if (!/\d/.test(password)) {
    errors.push("One number (0-9)");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/.test(password)) {
    errors.push("One special character (!@#$%^&*...)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export function ResetPasswordDialog({
  email,
  onSuccess,
  children,
}: ResetPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid) {
      toast({
        title: "Invalid Password",
        description: "Password does not meet security requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/reset-restaurant-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      toast({
        title: "Success",
        description: `Password for ${email} has been reset successfully.`,
      });

      setOpen(false);
      setNewPassword("");
      onSuccess?.();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for <span className="font-medium">{email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="newPassword" className="text-right mt-2">
                New Password
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className={
                    validation.valid && newPassword ? "border-green-500" : ""
                  }
                />
                {newPassword && (
                  <div className="text-xs space-y-1">
                    {validation.valid ? (
                      <p className="text-green-600 font-medium">
                        ✓ Password meets all requirements
                      </p>
                    ) : (
                      <div className="text-red-600 space-y-1">
                        <p className="font-medium">Password must contain:</p>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {validation.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !validation.valid}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
