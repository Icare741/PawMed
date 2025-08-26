import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/store"
import { register } from "@/app/reducers/AuthReducers"

export function PractitionerForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error: reduxError } = useSelector((state: RootState) => state.auth)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ordinal: "",
    clinicName: "",
    address: "",
    postalCode: "",
    city: "",
    siret: "",
    acceptTerms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      return
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`,
      isPractitioner: true,
      practitioner: {
        siret: formData.siret,
        address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
        speciality: formData.ordinal,
        clinicName: formData.clinicName,
        phone: "" // Optionnel pour l'instant
      }
    }


    try {
      const result = await dispatch(register(userData)).unwrap()
      if (result.token) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName" 
            className="h-8" 
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName" 
            className="h-8" 
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          className="h-8" 
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="ordinal">Numéro Ordinal</Label>
        <Input 
          id="ordinal" 
          className="h-8" 
          value={formData.ordinal}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="clinicName">Nom de la Clinique</Label>
        <Input 
          id="clinicName" 
          className="h-8" 
          value={formData.clinicName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Adresse</Label>
        <Input 
          id="address" 
          className="h-8" 
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="postalCode">Code Postal</Label>
          <Input 
            id="postalCode" 
            className="h-8" 
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">Ville</Label>
          <Input 
            id="city" 
            className="h-8" 
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="siret">SIRET</Label>
        <Input 
          id="siret" 
          className="h-8" 
          value={formData.siret}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Mot de passe</Label>
        <Input 
          id="password" 
          type="password" 
          className="h-8" 
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {reduxError && (
        <p className="text-sm text-red-500 text-center">{reduxError}</p>
      )}

      <div className="mt-6 flex flex-col items-center gap-4">
        <label className="flex items-center text-xs">
          <input 
            type="checkbox" 
            id="acceptTerms"
            className="mr-2 h-3 w-3" 
            checked={formData.acceptTerms}
            onChange={handleChange}
          />
          J'accepte les conditions
        </label>
        <Button 
          type="submit" 
          className="h-8 px-6"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </Button>
        <p className="text-xs text-center">
          Déjà un compte ? <Link to="/login" className="text-primary">Se connecter</Link>
        </p>
      </div>
    </form>
  )
}