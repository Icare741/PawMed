"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { User, Profile } from "../types/user";

export function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user as User);
  const [profile, setProfile] = useState<Profile>(
    user.profile || ({} as Profile)
  );

  const [editingSection, setEditingSection] = useState<
    "personalInfo" | "address" | null
  >(null);

  const handleEdit = (section: "personalInfo" | "address") => {
    setEditingSection(section);
  };

  const handleSave = () => {
    setEditingSection(null);
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
  };

  const handleCancel = () => {
    setEditingSection(null);
    setProfile(user.profile || ({} as Profile));
  };

  const renderEditableField = (
    section: "personalInfo" | "address",
    key: keyof Profile,
    value: string | null
  ) => {
    if (editingSection === section) {
      return (
        <Input
          value={value || ""}
          onChange={(e) => {
            setProfile((prev) => ({
              ...prev,
              [key]: e.target.value,
            }));
          }}
        />
      );
    }
    return <p>{value || "N/A"}</p>;
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Paramètres du compte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.avatar || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role?.name}</p>
            <p className="text-sm text-gray-500">{profile.address}</p>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            {editingSection === "personalInfo" ? (
              <div>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("personalInfo")}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["first_name", "last_name", "phone"].map((key) => (
              <div key={key}>
                <p className="text-sm text-gray-500">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                {renderEditableField(
                  "personalInfo",
                  key as keyof Profile,
                  profile[key as keyof Profile] as string | null
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Adresse</h3>
            {editingSection === "address" ? (
              <div>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit("address")}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {["address", "city", "state", "zip"].map((key) => (
                <div key={key}>
                  <p className="text-sm text-gray-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                  {renderEditableField(
                    "address",
                    key as keyof Profile,
                    profile[key as keyof Profile] as string | null
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
