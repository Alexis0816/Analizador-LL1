"use client";
import React from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, BookOpen, Users, GraduationCap, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RonaldImage from '../public/images/ronald.png';
import AlexisImage from '../public/images/ale.jpg';
import JoaquínImage from '../public/images/joaquin.png';
import YalascaImage from '../public/images/yalasca.png';
import { useRouter } from 'next/navigation';
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export default function Home() {
  const router = useRouter();

  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // Animation variants for staggered children
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Grid pattern background - fixed position and below all content */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <AnimatedGridPattern 
          className="w-full h-full"
          numSquares={24} 
          maxOpacity={0.15}
         
      
        
        />
      </div>
      
      {/* Content wrapper - all page content goes inside with higher z-index */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Hero Section */}
        <motion.div 
          className="max-w-4xl text-center py-20 px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Analizador Sintáctico
            <span className="block text-black border-b-2 border-black inline-block mt-2 pb-1">LL(1) Parser</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Proyecto del curso de Compiladores - Universidad de Ingeniería y Tecnología
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button onClick={() => router.push('/dashboard')} className="bg-black text-white hover:bg-gray-800 hover:scale-105 transition-transform">
              Ver Demostración <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-transform">
              Repositorio GitHub
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="w-full bg-white bg-opacity-95 border-t border-gray-200 py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.h2 
              className="text-3xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-black border-b-2 border-black inline-block pb-1">Características</span> del Analizador LL(1)
            </motion.h2>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeIn}>
                <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 rounded-full bg-gray-100 mb-4 border border-gray-300">
                      <Code className="h-6 w-6 text-black" />
                    </div>
                    <CardTitle className="text-xl text-center text-black">Análisis Sintáctico</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-600">
                      Implementación completa de un analizador LL(1) que procesa gramáticas y construye tablas de análisis sintáctico
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 rounded-full bg-gray-100 mb-4 border border-gray-300">
                      <BookOpen className="h-6 w-6 text-black" />
                    </div>
                    <CardTitle className="text-xl text-center text-black">Algoritmo Predictivo</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-600">
                      Implementación de algoritmos para First, Follow y construcción de tablas de análisis predictivo no recursivo
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="p-3 rounded-full bg-gray-100 mb-4 border border-gray-300">
                      <Users className="h-6 w-6 text-black" />
                    </div>
                    <CardTitle className="text-xl text-center text-black">Interfaz Interactiva</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-8">
                    <CardDescription className="text-gray-600">
                      Interfaz gráfica que permite visualizar el proceso paso a paso y facilita la comprensión del funcionamiento del analizador
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Team Members Section */}
<div className="w-full py-24 bg-white bg-opacity-95 border-t border-gray-200">
  <div className="container mx-auto max-w-6xl px-4">
    <motion.h2 
      className="text-3xl font-bold text-center mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <span className="text-black border-b-2 border-black inline-block pb-1">Equipo</span> de Desarrollo
    </motion.h2>

    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Team Member 1 */}
      <motion.div variants={fadeIn}>
        <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]">
          <CardHeader className="flex items-center justify-center pt-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 border-2 border-gray-300">
              <img src={RonaldImage.src} alt="Estudiante 1" className="w-full h-full object-cover" />
            </div>
            
          </CardHeader>
          <CardContent className="text-center px-6 pb-8">
          <CardTitle className="text-xl text-center text-black">Ronal Jesus Condor Blas</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ciencias de la Computación
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Member 2 */}
      <motion.div variants={fadeIn}>
        <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]">
          <CardHeader className="flex items-center justify-center pt-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 border-2 border-gray-300">
              <img src={AlexisImage.src} alt="Estudiante 1" className="w-full h-full object-cover" />
            </div>
            
          </CardHeader>
          <CardContent className="text-center px-6 pb-8">
          <CardTitle className="text-xl text-center text-black">Alexis Raza Estrada</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ciencias de la Computación
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Member 3 */}
      <motion.div variants={fadeIn}>
        <Card className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]">
          <CardHeader className="flex items-center justify-center pt-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 border-2 border-gray-300">
              <img src={JoaquínImage.src} alt="Estudiante 1" className="w-full h-full object-cover" />
            </div>
            
          </CardHeader>
          <CardContent className="text-center px-6 pb-8">
          <CardTitle className="text-xl text-center text-black">Joaquín Salinas Salas</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ciencias de la Computación
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  </div>
</div>

{/* Professor Section */}
<div className="w-full bg-gray-50 bg-opacity-95 border-t border-gray-200 text-black py-24">
  <div className="container mx-auto max-w-6xl px-4">
    <motion.h2 
      className="text-3xl font-bold text-center mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      Profesor del Curso
    </motion.h2>

    <motion.div 
      className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-300">
        <img src={YalascaImage.src} alt="Profesor" className="w-full h-full object-cover" />
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2">Julio Eduardo Yarasca Moscol</h3>
        <p className="text-gray-600 mb-6">Profesor Titular - Curso de Compiladores</p>
        
        <Tabs defaultValue="bio" className="w-full max-w-md">
          <TabsList className="bg-gray-100 text-black">
            <TabsTrigger value="bio" className="data-[state=active]:bg-black data-[state=active]:text-white">Biografía</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-black data-[state=active]:text-white">Contacto</TabsTrigger>
          </TabsList>
          <TabsContent value="bio" className="p-6 bg-white border border-gray-200 rounded-b-md mt-1 min-h-[200px]">
            <p className="mb-3">
            Bachiller en Matemáticas por la Universidad Nacional de Ingeniería y Magíster en Matemáticas Aplicadas por la Pontificia Universidad Catolica del Peru. Actualmente trabaja en herramientas computacionales para Finanzas Cuantitativas y Macroeconomía.
            </p>
            <p>
              Con más de 15 años de experiencia en investigación y docencia, ha participado 
              en el desarrollo de varios compiladores para lenguajes de propósito específico.
            </p>
          </TabsContent>
          
          <TabsContent value="contact" className="p-6 bg-white border border-gray-200 rounded-b-md mt-1 min-h-[200px]">
            <p className="mb-2">Email: jyarascam@utec.edu.pe</p>
            
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  </div>
</div>

{/* Course Information */}
<div className="w-full py-24 bg-white bg-opacity-95 border-t border-gray-200">
  <div className="container mx-auto max-w-4xl px-4 text-center">
    <motion.h2 
      className="text-3xl font-bold text-center mb-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <span className="text-black border-b-2 border-black inline-block pb-1">Sobre</span> el Curso
    </motion.h2>
    
    <motion.div 
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-bold mb-4 text-black">CS3902 - Compiladores</h3>
      <p className="text-gray-700 mb-8">
        El curso de Compiladores es una materia fundamental en la carrera de Ciencias de la Computación. 
        Explora los principios teóricos y prácticos del diseño e implementación de compiladores, 
        desde el análisis léxico hasta la generación de código.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div>
          <h4 className="font-bold text-black mb-4 border-b border-gray-300 pb-2">Objetivos del Curso:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Comprender las fases del proceso de compilación</li>
            <li>Implementar analizadores léxicos y sintácticos</li>
            <li>Desarrollar tablas de símbolos y análisis semántico</li>
            <li>Generar código intermedio y optimizarlo</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-black mb-4 border-b border-gray-300 pb-2">Temas Principales:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Gramáticas y lenguajes formales</li>
            <li>Análisis léxico y expresiones regulares</li>
            <li>Análisis sintáctico LL y LR</li>
            <li>Análisis semántico y generación de código</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>
</div>

{/* Footer */}
<footer className="w-full bg-black bg-opacity-95 border-t border-gray-200 text-black py-12">
  <motion.div 
    className="container mx-auto text-center"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <p className="mb-4 text-white">Proyecto del Curso de Compiladores - Universidad de Ingeniería y Tecnología</p>
    <p className="text-gray-500 text-sm">© 2025 - Ciencias de la Computación</p>
  </motion.div>
</footer>
      </div> {/* End of content wrapper */}
    </div> /* End of main container */
  );
}