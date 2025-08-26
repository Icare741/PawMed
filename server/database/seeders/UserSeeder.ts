import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Role from "App/Models/Role";
import Practitioner from "App/Models/Practitioner";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Créer d'abord le rôle admin s'il n'existe pas
    const adminRole = await Role.firstOrCreate(
      { name: "admin" },
      { name: "admin" }
    );

    // Créer l'utilisateur admin
    const adminUser = await User.firstOrCreate(
      { email: "admin@admin.com" },
      {
        name: "Admin",
        email: "admin@admin.com",
        password: await Hash.make("admin"),
        roleId: adminRole.id,
        status: "active",
      }
    );

    // Créer le profil admin s'il n'existe pas déjà
    await adminUser.related("profile").firstOrCreate(
      {},
      {
        avatar: "/placeholder.svg?height=80&width=80",
        firstName: "Rafiqur",
        lastName: "Rahman",
        city: "Paris",
        state: "Ile-de-France",
        zip: "75000",
        address: "123 Rue de la Paix",
        phone: "+33 6 34 53 46 46",
      }
    );

    // Créer le praticien pour l'admin s'il n'existe pas déjà
    await Practitioner.firstOrCreate(
      { userId: adminUser.id },
      {
        userId: adminUser.id,
        clinicName: "Clinique Vétérinaire du Centre",
        speciality: "Vétérinaire généraliste",
        description: "Vétérinaire expérimenté spécialisé dans les petits animaux",
        siret: "12345678900000",
        address: "123 Rue de la Paix, 75000 Paris",
        phone: "+33 6 34 53 46 46"
      }
    );
  }
}
