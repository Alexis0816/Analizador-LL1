"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Code, BookOpen } from "lucide-react";
import PDFDownloadButton from '@/components/PDFDownloadButton'; // Importar el componente

// Importar el analizador LL1
import LL1, {
  Stack, Grammar, loadGrammar, parseWithTrace, computeFirst, computeFollow, 
  buildLL1Table, analyze, tokenize
} from '@/lib/LL1';

// Ejemplos predefinidos
const EXAMPLE1_GRAMMAR = `P → SL
SL → S SL'
SL' → ; S SL'
SL' → ε
S → id = E
S → print ( E )
E → T E'
E' → + T E'
E' → - T E'
E' → ε
T → F T'
T' → * F T'
T' → ε
F → id
F → num
F → ( E )`;

const EXAMPLE2_GRAMMAR = `F → fun id ( P ) { B }
P → id P'
P → ε 
P' → , id P'
P' → ε 
B → S B
B → ε 
S → return E ;
E → id`;

// Componente de título animado para las tablas
import { ReactNode } from 'react';

const AnimatedTableTitle = ({ children }: { children: ReactNode }) => (
  <motion.h2 
    className="text-2xl font-bold mb-4"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.h2>
);

// Componente para las filas de tabla con animación
const AnimatedTableRow = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer group"
    whileHover={{ 
      backgroundColor: "rgba(0,0,0,0.05)",
      transition: { duration: 0.1 }
    }}
  >
    {children}
  </motion.tr>
);

export default function Dashboard() {
  const [grammar, setGrammar] = useState<string>(EXAMPLE1_GRAMMAR);
  const [input, setInput] = useState<string>("id = num + num ; print ( id + num )");
  const [results, setResults] = useState<{
    firstFollow: { nonTerminal: string, first: string[], follow: string[] }[],
    ll1Table: { nonTerminal: string, terminals: Record<string, string> }[], // Keep original type
    derivation: { stack: string[], input: string[], rule: string }[]
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("grammar");
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Verificar si el script está cargado
  useEffect(() => {
    // Comprobar si ya está disponible
    if (typeof window !== 'undefined' && (window as any).loadGrammar) {
      setIsScriptLoaded(true);
      console.log("Script LL1.js detectado y listo para usar");
    } else {
      // Registrar callback para cuando se cargue
      LL1.onScriptLoaded(() => {
        setIsScriptLoaded(true);
        console.log("Script LL1.js cargado mediante callback");
      });
      
      // Manejar el caso en que el script no se cargue después de un tiempo
      const timeout = setTimeout(() => {
        if (!isScriptLoaded) {
          setError(
            "No se pudo cargar el analizador LL(1). Por favor verifica lo siguiente:\n" +
            "1. El archivo LL1.js debe estar en la carpeta /public/scripts/\n" +
            "2. El archivo debe tener el nombre exacto 'LL1.js' (distingue mayúsculas y minúsculas)\n" +
            "3. El contenido del archivo debe incluir las funciones necesarias (loadGrammar, parseWithTrace, etc.)\n" +
            "Verifica la consola del navegador para más detalles sobre el error."
          );
        }
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isScriptLoaded]);

  // Función para analizar la gramática y la entrada
  const handleAnalysis = () => {
    if (!isScriptLoaded) {
      setError("El analizador LL(1) aún no está listo. Por favor, espera un momento.");
      return;
    }

    if (!grammar.trim() || !input.trim()) {
      setError("Por favor ingrese una gramática y una cadena de entrada");
      setResults(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("Analizando gramática:", grammar);
      
      // Cargar la gramática
      const grammarObj = loadGrammar(grammar);
      console.log("Gramática cargada:", grammarObj);
      
      if (!grammarObj || !grammarObj.orderedProductions || grammarObj.orderedProductions.length === 0) {
        setError("Gramática no válida o vacía. Verifica la sintaxis y los símbolos utilizados.");
        setResults(null);
        setIsAnalyzing(false);
        return;
      }
      
      // Tokenizar la entrada
      const tokens = tokenize(input, grammarObj);
      console.log("Tokens:", tokens);
      
      if (!tokens || tokens.length === 0) {
        setError("Expresión contiene errores en los tokens. Verifica que los símbolos estén definidos en la gramática.");
        setResults(null);
        setIsAnalyzing(false);
        return;
      }

      // Realizar análisis sintáctico con traza
      const trace = parseWithTrace([...tokens], grammarObj);
      console.log("Trace:", trace);
      
      // Calcular FIRST y FOLLOW
      const first = computeFirst(grammarObj);
      const follow = computeFollow(grammarObj, first);
      
      // Construir tabla LL(1)
      const ll1Table = buildLL1Table(grammarObj);
      
      // Preparar resultados
      const terminals = Array.from(grammarObj.terminals).sort();
      
      // Formato para tabla FIRST/FOLLOW
      const firstFollowData = Array.from(grammarObj.nonTerminals).map(nt => {
        // Convertimos explícitamente nt a string para usarlo como clave
        const ntStr = String(nt);
        return {
          nonTerminal: ntStr,
          first: Array.from(first.get(ntStr) || new Set()).map(String),
          follow: Array.from(follow.get(ntStr) || new Set()).map(String)
        };
      });
      
      // Formato para tabla LL(1) con soporte para explore/extract
      const ll1TableData = Array.from(grammarObj.nonTerminals).map(nt => {
        const ntStr = String(nt);
        const terminalEntries: Record<string, string> = {}; // Keep as string
        
        terminals.forEach(term => {
          const termStr = String(term);
          const tableLookup = ll1Table.get(ntStr);
          let cellValue = '';
          
          // Determine if it should be a production, extract, or explore
          if (tableLookup && tableLookup.get(termStr)) {
            cellValue = String(tableLookup.get(termStr));
          } else if (follow.get(ntStr)?.has(termStr)) {
            cellValue = 'extract';
          } else {
            cellValue = 'explore';
          }
          
          terminalEntries[termStr] = cellValue;
        });
        
        return {
          nonTerminal: ntStr,
          terminals: terminalEntries
        };
      });
      
      // Setear resultados
      setResults({
        firstFollow: firstFollowData,
        ll1Table: ll1TableData,
        derivation: trace.map((step: any) => ({
          stack: Array.isArray(step.stack) ? step.stack.map(String) : [],
          input: Array.isArray(step.input) ? step.input.map(String) : [],
          rule: String(step.rule || '')
        }))
      });
      
      // Mostrar animación de éxito
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Cambiar a la pestaña de resultados
        setActiveTab("results");
      }, 1500);
      
    } catch (err: any) {
      console.error("Error durante el análisis:", err);
      setError(`Error: ${err.message}`);
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manejadores para el estado de generación de PDF
  const handlePDFGenerateStart = () => {
    setIsGeneratingPDF(true);
  };

  const handlePDFGenerateEnd = () => {
    setIsGeneratingPDF(false);
  };

  // Cargar ejemplos predefinidos
  const loadExample1 = () => {
    setGrammar(EXAMPLE1_GRAMMAR);
    setInput("id = num + num ; print ( id + num )");
    setError(null);
  };

  const loadExample2 = () => {
    setGrammar(EXAMPLE2_GRAMMAR);
    setInput("fun id ( id , id ) { return id ; }");
    setError(null);
  };

  const clearAll = () => {
    setGrammar("");
    setInput("");
    setResults(null);
    setError(null);
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Función para obtener la clase CSS según la acción
  const getCellClass = (value: string) => {
    if (value === 'extract') {
      return 'bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700';
    } else if (value === 'explore') {
      return 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700';
    } else if (value && value !== '-') {
      return 'bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600';
    }
    return '';
  };

  return (
    <motion.div 
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      id="pdf-container"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Card className="mb-6 shadow-lg ">
          <CardHeader className="relative overflow-hidden">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r text-black bg-clip-text">
              Analizador LL(1) Parser
            </CardTitle>
            <CardDescription className="text-lg">
              Herramienta para analizar gramáticas y validar cadenas utilizando el método LL(1)
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {!isScriptLoaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="mb-6 border-2 border-gray-300 dark:border-gray-700">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <AlertTitle>Cargando analizador</AlertTitle>
            <AlertDescription>
              Inicializando el analizador LL(1)...
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded-md shadow-lg z-50"
        >
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>Análisis completado exitosamente</p>
          </div>
        </motion.div>
      )}

      {isGeneratingPDF && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-10 right-10 bg-blue-500 text-white p-4 rounded-md shadow-lg z-50"
        >
          <div className="flex items-center">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            <p>Generando PDF...</p>
          </div>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="grammar" className="transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded">
            <div className="flex items-center">
              <Code className="mr-2 h-4 w-4" />
              Gramática y Entrada
            </div>
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!results} className="transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded">
            <div className="flex items-center">
              <Terminal className="mr-2 h-4 w-4" />
              Resultados
            </div>
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          {activeTab === "grammar" && (
            <motion.div
              key="grammar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="grammar" className="mt-0">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpen className="mr-2 h-5 w-5" />
                          Gramática
                        </CardTitle>
                        <CardDescription>Ingrese la gramática utilizando la notación con → y ε para epsilon</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          placeholder="Ingrese su gramática aquí..." 
                          value={grammar} 
                          onChange={(e) => setGrammar(e.target.value)}
                          className="font-mono h-60 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Terminal className="mr-2 h-5 w-5" />
                          Cadena de Entrada
                        </CardTitle>
                        <CardDescription>Ingrese la cadena a analizar con la gramática definida</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          placeholder="Ingrese la cadena a analizar..." 
                          value={input} 
                          onChange={(e) => setInput(e.target.value)}
                          className="font-mono h-32 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="mt-6 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Button 
                    onClick={handleAnalysis} 
                    disabled={isAnalyzing || !isScriptLoaded}
                    className="bg-gray-900 hover:bg-gray-700 text-white transition-colors duration-300"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analizando...
                      </>
                    ) : "Analizar"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadExample1}
                    className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    Ejemplo 1
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadExample2}
                    className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    Ejemplo 2
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={clearAll}
                    className="hover:bg-red-700 transition-colors duration-300"
                  >
                    Limpiar
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive" className="mt-6 border border-red-500">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="results" className="mt-0">
                {results && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Botón de descarga de PDF como componente */}
                    <PDFDownloadButton 
                      grammar={grammar}
                      input={input}
                      results={results}
                      onGenerateStart={handlePDFGenerateStart}
                      onGenerateEnd={handlePDFGenerateEnd}
                    />

                    <motion.div variants={itemVariants}>
                      <Card className="mb-6 shadow-lg border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-2">
                          <AnimatedTableTitle>Conjuntos FIRST y FOLLOW</AnimatedTableTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b-2 border-gray-400 dark:border-gray-600">
                                  <TableHead className="text-lg font-bold">No Terminal</TableHead>
                                  <TableHead className="text-lg font-bold">FIRST</TableHead>
                                  <TableHead className="text-lg font-bold">FOLLOW</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {results.firstFollow.map((item, index) => (
                                  <AnimatedTableRow key={index} index={index}>
                                    <TableCell className="font-mono text-gray-900 dark:text-gray-100">{item.nonTerminal}</TableCell>
                                    <TableCell className="font-mono text-gray-900 dark:text-gray-100">{"{ " + item.first.join(", ") + " }"}</TableCell>
                                    <TableCell className="font-mono text-gray-900 dark:text-gray-100">{"{ " + item.follow.join(", ") + " }"}</TableCell>
                                  </AnimatedTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="mb-6 shadow-lg border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-2">
                          <AnimatedTableTitle>Tabla LL(1)</AnimatedTableTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b-2 border-gray-400 dark:border-gray-600">
                                <TableHead className="text-lg font-bold sticky left-0 bg-white dark:bg-gray-900 z-10">No Terminal</TableHead>
                                {Object.keys(results.ll1Table[0]?.terminals || {}).map((terminal, idx) => (
                                  <TableHead key={idx} className="font-mono text-lg font-bold">{terminal}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.ll1Table.map((row, index) => (
                                <AnimatedTableRow key={index} index={index}>
                                  <TableCell className="font-mono sticky left-0 bg-white dark:bg-gray-900 z-10 text-gray-900 dark:text-gray-100 group-hover:bg-gray-100 dark:group-hover:bg-gray-800">{row.nonTerminal}</TableCell>
                                  {Object.entries(row.terminals).map(([terminal, value], idx) => (
  <TableCell 
    key={idx} 
    className={`font-mono whitespace-nowrap text-gray-900 dark:text-gray-100 transition-colors duration-200 ${getCellClass(value)}`}
  >
    {value}
  </TableCell>
))}
                                </AnimatedTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="shadow-lg border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-2">
                          <AnimatedTableTitle>Tabla de Derivación</AnimatedTableTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b-2 border-gray-400 dark:border-gray-600">
                                <TableHead className="text-lg font-bold">PILA</TableHead>
                                <TableHead className="text-lg font-bold">ENTRADA</TableHead>
                                <TableHead className="text-lg font-bold">ACCIÓN</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.derivation.map((step, index) => (
                                <AnimatedTableRow key={index} index={index}>
                                  <TableCell className="font-mono whitespace-nowrap text-gray-900 dark:text-gray-100">{step.stack.join(' ')}</TableCell>
                                  <TableCell className="font-mono whitespace-nowrap text-gray-900 dark:text-gray-100">{step.input.join(' ')}</TableCell>
                                  <TableCell className="font-mono text-gray-900 dark:text-gray-100">{step.rule}</TableCell>
                                </AnimatedTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}