'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, AlertCircle, PawPrint, ArrowRight } from "lucide-react"
import { Form, Field } from 'react-final-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { login } from '@/app/reducers/AuthReducers'
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import image from '@/assets/images/background_login.jpg'

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function PrettyLogin() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)  
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    {
      url: image,
      title: "Prenez soin de vos animaux",
      description: "PawMed connecte les propriétaires d'animaux avec les meilleurs vétérinaires"
    },
    {
      url: image,
      title: "Des soins de qualité",
      description: "Nos vétérinaires sont à votre écoute pour le bien-être de vos animaux"
    },
    {
      url: image,
      title: "Suivi personnalisé",
      description: "Gardez un historique complet des soins de votre animal"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await dispatch(login({ email: values.email, password: values.password })).unwrap()
      if (result.message === "Connexion réussie") {
        navigate('/');
      }
    } catch (error: any) {
      // L'erreur est déjà gérée par Redux, on ne fait rien ici
      // Le composant se mettra à jour automatiquement avec l'état d'erreur
      console.log('Erreur de connexion:', error);
    }
  }

  // Réinitialiser l'erreur quand l'utilisateur tape
  const handleInputChange = () => {
    if (error) {
      // On pourrait dispatcher une action pour réinitialiser l'erreur
      // Mais pour l'instant, on laisse Redux gérer
    }
  }

  return (
    <div className="h-screen flex relative bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Éléments décoratifs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-[#F4A259]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#7A90C3]/5 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="absolute top-6 md:top-8 left-6 md:left-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.img
            src="/img/logo.svg"
            alt="Pawmed"
            className="h-12 md:h-20 w-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
      </div>

      {/* Partie gauche */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center relative"
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full px-4 md:px-0 mt-20 md:mt-16"
        >
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#F4A259] to-[#e08a2b] rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-[#7A90C3] rounded-full flex items-center justify-center shadow-md"
              >
                <PawPrint className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{fontFamily:'inherit'}}>Bienvenue !</h2>
            <p className="text-gray-600 text-lg">Connectez-vous à votre compte</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center shadow-sm"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}

          <Form<FormValues>
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Adresse email
                      </Label>
                      <div className="relative group">
                        <Input
                          {...input}
                          id="email"
                          type="email"
                          placeholder="Entrez votre email"
                          className="pl-12 w-full border-gray-200 focus:border-[#F4A259] focus:ring-[#F4A259] rounded-xl transition-all duration-300 group-hover:border-[#F4A259]/50"
                          required
                          onChange={(e) => {
                            input.onChange(e);
                            handleInputChange();
                          }}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#F4A259] transition-colors" />
                      </div>
                      {meta.touched && meta.error && <span className="text-red-500 text-sm">{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <Field name="password">
                  {({ input, meta }) => (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mot de passe
                      </Label>
                      <div className="relative group">
                        <Input
                          {...input}
                          id="password"
                          type="password"
                          placeholder="Entrez votre mot de passe"
                          className="pl-12 w-full border-gray-200 focus:border-[#F4A259] focus:ring-[#F4A259] rounded-xl transition-all duration-300 group-hover:border-[#F4A259]/50"
                          required
                          onChange={(e) => {
                            input.onChange(e);
                            handleInputChange();
                          }}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#F4A259] transition-colors" />
                      </div>
                      {meta.touched && meta.error && <span className="text-red-500 text-sm">{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <div className="flex items-center justify-between">
                  <Field name="rememberMe" type="checkbox">
                    {({ input }) => (
                      <div className="flex items-center">
                        <input
                          {...input}
                          id="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-[#F4A259] focus:ring-[#F4A259] border-gray-300 rounded"
                        />
                        <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Se souvenir de moi
                        </Label>
                      </div>
                    )}
                  </Field>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-[#F4A259] hover:text-[#e08a2b] transition-colors">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F4A259] to-[#e08a2b] text-white font-bold text-lg py-6 rounded-xl hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                  disabled={isLoading}
                  style={{fontFamily:'inherit'}}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
                
                {/* Affichage de l'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 text-sm">
                      {error === 'Request failed with status code 401' 
                        ? 'Email ou mot de passe incorrect' 
                        : error}
                    </span>
                  </motion.div>
                )}
              </form>
            )}
          />
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="font-medium text-[#F4A259] hover:text-[#e08a2b] transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Partie droite - Carousel */}
      <div className="hidden md:block w-1/2 h-screen overflow-hidden relative">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <img
            src={images[currentImageIndex].url}
            alt="Animaux de compagnie"
            className="w-full h-full object-cover"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 left-8 max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl z-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{fontFamily:'inherit'}}>
              {images[currentImageIndex].title}
            </h2>
            <p className="text-white/90 text-lg">
              {images[currentImageIndex].description}
            </p>
          </motion.div>

          <div className="absolute bottom-6 right-6 flex gap-3 z-20">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-[#F4A259] w-8' : 'bg-white/50'
                }`}
                animate={{
                  scale: index === currentImageIndex ? 1.2 : 1,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
