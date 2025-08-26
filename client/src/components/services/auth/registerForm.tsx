'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, User, GraduationCap } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { UserForm } from "./UserForm"
import { PractitionerForm } from "./PractitionerForm"
import image from '@/assets/images/background_login.jpg'

export function PrettySignup() {
  const [step, setStep] = useState(1)
  const [isPractitioner, setIsPractitioner] = useState<boolean | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    {
      url: image,
      title: "Prenez soin de vos animaux",
      description: "PawMed connecte les propriétaires d'animaux avec les meilleurs vétérinaires"
    },
    {
      url: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
      title: "Des soins de qualité",
      description: "Nos vétérinaires sont à votre écoute pour le bien-être de vos animaux"
    },
    {
      url: "https://media.istockphoto.com/id/1386206447/fr/photo/chien-brown-border-collie-lors-dune-visite-chez-le-v%C3%A9t%C3%A9rinaire.jpg?s=612x612&w=0&k=20&c=6U83WBfA2IpVp64ET3s_yD1HYgQsIC_R9EZm66FMTSE=",
      title: "Suivi personnalisé",
      description: "Gardez un historique complet des soins de votre animal"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change d'image toutes les 5 secondes

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-screen flex relative">
      {/* Logo PawMed - Ajustement du positionnement */}
      <div className="absolute top-4 md:top-8 left-4 md:left-8 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">PawMed</h1>
      </div>

      {/* Partie gauche */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center relative"
      >

        {step === 1 ? (
          <div className="max-w-md w-full px-4 md:px-0 mt-20 md:mt-16">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-8">Comment souhaitez-vous utiliser PawMed ?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsPractitioner(false)
                  setStep(2)
                }}
                className="p-6 rounded-xl border-2 hover:border-primary/50 flex flex-col items-center gap-4"
              >
                <User className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Utilisateur</h3>
                  <p className="text-sm text-gray-500">Pour les propriétaires d'animaux</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsPractitioner(true)
                  setStep(2)
                }}
                className="p-6 rounded-xl border-2 hover:border-primary/50 flex flex-col items-center gap-4"
              >
                <GraduationCap className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Praticien</h3>
                  <p className="text-sm text-gray-500">Pour les vétérinaires</p>
                </div>
              </motion.button>
            </div>
          </div>
        ) : step === 2 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md w-full px-4 md:px-0 mt-20 md:mt-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setStep(1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </motion.button>
              <h2 className="text-xl md:text-2xl font-bold">Créez votre compte</h2>
            </div>

            {isPractitioner ? <PractitionerForm /> : <UserForm />}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Partie droite - Carousel */}
      <div className="hidden md:block w-1/2 h-screen overflow-hidden">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <img
              src={images[currentImageIndex].url}
              alt="Animaux de compagnie"
              className="w-full h-full object-cover"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 left-8 max-w-md p-6 bg-black/30 rounded-xl backdrop-blur-sm"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                {images[currentImageIndex].title}
              </h2>
              <p className="text-white/90">
                {images[currentImageIndex].description}
              </p>
            </motion.div>

            {/* Indicateurs de position */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {images.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  animate={{
                    scale: index === currentImageIndex ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  )
}
