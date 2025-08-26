import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "../../Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Practitioner from "../../Models/Practitioner";
import Profile from "../../Models/Profile";

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const token = await auth.use("api").attempt(email, password);
      const user = await User.query()
        .where("id", token.user.id)
        .preload("role")
        .preload("profile")
        .firstOrFail();

      return response.ok({
        message: "Connexion réussie",
        token: token.token,
        user: user,
      });
    } catch (error) {

      return response.unauthorized({
        message: "Identifiants invalides",
      });
    }
  }

  public async register({ request, auth, response }: HttpContextContract) {
    try {
      const payload = request.only([
        'email',
        'password',
        'name',
        'isPractitioner',
        'practitioner'
      ])

      const { email, password, name, isPractitioner, practitioner } = payload

      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({
          message: "Cet email est déjà utilisé"
        })
      }

      // Création de l'utilisateur
      const user = await User.create({
        email,
        password: await Hash.make(password),
        name,
        roleId: isPractitioner ? 2 : 1,
        status: 'active'
      })


      // Si c'est un praticien, créer l'entrée dans la table practitioners
      if (isPractitioner && practitioner) {
        try {
          const practitionerData = {
            userId: user.id,
            siret: practitioner.siret,
            address: practitioner.address,
            phone: practitioner.phone || '',
            speciality: practitioner.speciality,
            clinicName: practitioner.clinicName
          }



          const newPractitioner = await Practitioner.create(practitionerData)
          console.log('Praticien créé:', newPractitioner.toJSON())
        } catch (practitionerError) {
          console.error('Erreur lors de la création du praticien:', practitionerError)
          // Supprimer l'utilisateur si la création du praticien échoue
          await user.delete()
          throw practitionerError
        }
      }

      // Créer un profil vide pour l'utilisateur
      await Profile.create({
        userId: user.id
      })

      // Charger les relations
      await user.load('role')
      await user.load('profile')
      if (isPractitioner) {
        await user.load('practitioner')
      }

      const token = await auth.use('api').login(user)

      return response.created({
        user,
        token: token.token
      })
    } catch (error) {
      console.error('Erreur complète lors de l\'inscription:', error)
      return response.badRequest({
        message: "Une erreur est survenue lors de l'inscription",
        error: error.message,
        details: error
      })
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use("api").logout();
    return { message: "Déconnexion réussie" };
  }

  public async me({ auth }: HttpContextContract) {
    return auth.use("api").user;
  }
}
