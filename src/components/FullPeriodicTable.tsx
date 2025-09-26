import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Download, X } from "lucide-react";
import { toast } from "sonner";

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  group: number;
  period: number;
  category: string;
  state: 'solid' | 'liquid' | 'gas' | 'unknown';
  electronConfiguration: string;
  description: string;
  discoveryYear?: number;
  discoveredBy?: string;
  color: string;
}

// Complete periodic table data (all 118 elements)
const periodicElements: Element[] = [
  // Period 1
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, group: 1, period: 1, category: 'Nonmetal', state: 'gas', electronConfiguration: '1s¹', description: 'The lightest and most abundant element in the universe.', discoveryYear: 1766, discoveredBy: 'Henry Cavendish', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, atomicMass: 4.003, group: 18, period: 1, category: 'Noble Gas', state: 'gas', electronConfiguration: '1s²', description: 'Second lightest element, chemically inert noble gas.', discoveryYear: 1868, discoveredBy: 'Pierre Janssen', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  
  // Period 2
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, atomicMass: 6.941, group: 1, period: 2, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[He] 2s¹', description: 'Lightest metal, used in batteries and mood stabilizers.', discoveryYear: 1817, discoveredBy: 'Johan August Arfwedson', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, atomicMass: 9.012, group: 2, period: 2, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[He] 2s²', description: 'Light, strong metal used in aerospace applications.', discoveryYear: 1798, discoveredBy: 'Louis-Nicolas Vauquelin', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, atomicMass: 10.811, group: 13, period: 2, category: 'Metalloid', state: 'solid', electronConfiguration: '[He] 2s² 2p¹', description: 'Metalloid essential for plant growth.', discoveryYear: 1808, discoveredBy: 'Joseph Louis Gay-Lussac', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.011, group: 14, period: 2, category: 'Nonmetal', state: 'solid', electronConfiguration: '[He] 2s² 2p²', description: 'Basis of all organic compounds and life.', discoveryYear: -3750, discoveredBy: 'Ancient', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.007, group: 15, period: 2, category: 'Nonmetal', state: 'gas', electronConfiguration: '[He] 2s² 2p³', description: 'Makes up 78% of Earth\'s atmosphere.', discoveryYear: 1772, discoveredBy: 'Daniel Rutherford', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 15.999, group: 16, period: 2, category: 'Nonmetal', state: 'gas', electronConfiguration: '[He] 2s² 2p⁴', description: 'Essential for respiration and combustion.', discoveryYear: 1774, discoveredBy: 'Joseph Priestley', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 18.998, group: 17, period: 2, category: 'Halogen', state: 'gas', electronConfiguration: '[He] 2s² 2p⁵', description: 'Most electronegative element, used in toothpaste.', discoveryYear: 1886, discoveredBy: 'Henri Moissan', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, atomicMass: 20.180, group: 18, period: 2, category: 'Noble Gas', state: 'gas', electronConfiguration: '[He] 2s² 2p⁶', description: 'Noble gas used in neon signs and lighting.', discoveryYear: 1898, discoveredBy: 'William Ramsay', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  
  // Period 3
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, atomicMass: 22.990, group: 1, period: 3, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[Ne] 3s¹', description: 'Essential electrolyte, component of table salt.', discoveryYear: 1807, discoveredBy: 'Humphry Davy', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, atomicMass: 24.305, group: 2, period: 3, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[Ne] 3s²', description: 'Light metal used in alloys and supplements.', discoveryYear: 1808, discoveredBy: 'Humphry Davy', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, atomicMass: 26.982, group: 13, period: 3, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Ne] 3s² 3p¹', description: 'Lightweight, corrosion-resistant metal.', discoveryYear: 1825, discoveredBy: 'Hans Christian Ørsted', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, atomicMass: 28.085, group: 14, period: 3, category: 'Metalloid', state: 'solid', electronConfiguration: '[Ne] 3s² 3p²', description: 'Semiconductor material, basis of computer chips.', discoveryYear: 1824, discoveredBy: 'Jöns Jacob Berzelius', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.974, group: 15, period: 3, category: 'Nonmetal', state: 'solid', electronConfiguration: '[Ne] 3s² 3p³', description: 'Essential for DNA, RNA, and energy storage.', discoveryYear: 1669, discoveredBy: 'Hennig Brand', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.065, group: 16, period: 3, category: 'Nonmetal', state: 'solid', electronConfiguration: '[Ne] 3s² 3p⁴', description: 'Component of proteins and many minerals.', discoveryYear: -2000, discoveredBy: 'Ancient', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.453, group: 17, period: 3, category: 'Halogen', state: 'gas', electronConfiguration: '[Ne] 3s² 3p⁵', description: 'Disinfectant and component of table salt.', discoveryYear: 1774, discoveredBy: 'Carl Wilhelm Scheele', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, atomicMass: 39.948, group: 18, period: 3, category: 'Noble Gas', state: 'gas', electronConfiguration: '[Ne] 3s² 3p⁶', description: 'Inert gas used in welding and light bulbs.', discoveryYear: 1894, discoveredBy: 'Lord Rayleigh', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  
  // Period 4
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, atomicMass: 39.098, group: 1, period: 4, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[Ar] 4s¹', description: 'Essential electrolyte for nerve and muscle function.', discoveryYear: 1807, discoveredBy: 'Humphry Davy', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, atomicMass: 40.078, group: 2, period: 4, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[Ar] 4s²', description: 'Essential for bones, teeth, and muscle function.', discoveryYear: 1808, discoveredBy: 'Humphry Davy', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, atomicMass: 44.956, group: 3, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d¹ 4s²', description: 'Rare earth metal used in aerospace alloys.', discoveryYear: 1879, discoveredBy: 'Lars Fredrik Nilson', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, atomicMass: 47.867, group: 4, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d² 4s²', description: 'Strong, lightweight metal used in aerospace.', discoveryYear: 1791, discoveredBy: 'William Gregor', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'V', name: 'Vanadium', atomicNumber: 23, atomicMass: 50.942, group: 5, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d³ 4s²', description: 'Used in steel alloys for strength.', discoveryYear: 1801, discoveredBy: 'Andrés Manuel del Río', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, atomicMass: 51.996, group: 6, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d⁵ 4s¹', description: 'Used for chrome plating and stainless steel.', discoveryYear: 1797, discoveredBy: 'Louis Nicolas Vauquelin', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, atomicMass: 54.938, group: 7, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d⁵ 4s²', description: 'Essential for steel production and biology.', discoveryYear: 1774, discoveredBy: 'Johan Gottlieb Gahn', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, atomicMass: 55.845, group: 8, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d⁶ 4s²', description: 'Most common element on Earth, essential for life.', discoveryYear: -5000, discoveredBy: 'Ancient', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, atomicMass: 58.933, group: 9, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d⁷ 4s²', description: 'Used in batteries and magnetic alloys.', discoveryYear: 1735, discoveredBy: 'Georg Brandt', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, atomicMass: 58.693, group: 10, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d⁸ 4s²', description: 'Corrosion-resistant metal used in coins.', discoveryYear: 1751, discoveredBy: 'Axel Fredrik Cronstedt', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, atomicMass: 63.546, group: 11, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s¹', description: 'Excellent conductor used in wiring.', discoveryYear: -9000, discoveredBy: 'Ancient', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, atomicMass: 65.38, group: 12, period: 4, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s²', description: 'Essential mineral, used in galvanizing.', discoveryYear: 1746, discoveredBy: 'Andreas Sigismund Marggraf', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, atomicMass: 69.723, group: 13, period: 4, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', description: 'Low melting point metal used in electronics.', discoveryYear: 1875, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Ge', name: 'Germanium', atomicNumber: 32, atomicMass: 72.630, group: 14, period: 4, category: 'Metalloid', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', description: 'Semiconductor used in electronics.', discoveryYear: 1886, discoveredBy: 'Clemens Winkler', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'As', name: 'Arsenic', atomicNumber: 33, atomicMass: 74.922, group: 15, period: 4, category: 'Metalloid', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', description: 'Toxic metalloid used in semiconductors.', discoveryYear: 1250, discoveredBy: 'Albertus Magnus', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'Se', name: 'Selenium', atomicNumber: 34, atomicMass: 78.971, group: 16, period: 4, category: 'Nonmetal', state: 'solid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', description: 'Essential trace element and antioxidant.', discoveryYear: 1817, discoveredBy: 'Jöns Jacob Berzelius', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'Br', name: 'Bromine', atomicNumber: 35, atomicMass: 79.904, group: 17, period: 4, category: 'Halogen', state: 'liquid', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', description: 'Liquid halogen used in flame retardants.', discoveryYear: 1826, discoveredBy: 'Antoine Jérôme Balard', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, atomicMass: 83.798, group: 18, period: 4, category: 'Noble Gas', state: 'gas', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', description: 'Noble gas used in lighting and lasers.', discoveryYear: 1898, discoveredBy: 'William Ramsay', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },

  // Period 5
  { symbol: 'Rb', name: 'Rubidium', atomicNumber: 37, atomicMass: 85.468, group: 1, period: 5, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[Kr] 5s¹', description: 'Soft alkali metal used in atomic clocks.', discoveryYear: 1861, discoveredBy: 'Robert Bunsen', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Sr', name: 'Strontium', atomicNumber: 38, atomicMass: 87.62, group: 2, period: 5, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[Kr] 5s²', description: 'Used in fireworks for red color.', discoveryYear: 1790, discoveredBy: 'Adair Crawford', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'Y', name: 'Yttrium', atomicNumber: 39, atomicMass: 88.906, group: 3, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹ 5s²', description: 'Used in superconductors and lasers.', discoveryYear: 1794, discoveredBy: 'Johan Gadolin', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, atomicMass: 91.224, group: 4, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d² 5s²', description: 'Corrosion-resistant metal used in nuclear reactors.', discoveryYear: 1789, discoveredBy: 'Martin Heinrich Klaproth', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Nb', name: 'Niobium', atomicNumber: 41, atomicMass: 92.906, group: 5, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d⁴ 5s¹', description: 'Used in superconducting magnets.', discoveryYear: 1801, discoveredBy: 'Charles Hatchett', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, atomicMass: 95.95, group: 6, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d⁵ 5s¹', description: 'Used in steel alloys and catalysts.', discoveryYear: 1778, discoveredBy: 'Carl Wilhelm Scheele', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Tc', name: 'Technetium', atomicNumber: 43, atomicMass: 98, group: 7, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d⁵ 5s²', description: 'First artificially produced element.', discoveryYear: 1937, discoveredBy: 'Emilio Segrè', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, atomicMass: 101.07, group: 8, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d⁷ 5s¹', description: 'Used in electronics and catalysts.', discoveryYear: 1844, discoveredBy: 'Karl Ernst Claus', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, atomicMass: 102.91, group: 9, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d⁸ 5s¹', description: 'Precious metal used in catalytic converters.', discoveryYear: 1803, discoveredBy: 'William Hyde Wollaston', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Pd', name: 'Palladium', atomicNumber: 46, atomicMass: 106.42, group: 10, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰', description: 'Used in catalysts and jewelry.', discoveryYear: 1803, discoveredBy: 'William Hyde Wollaston', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ag', name: 'Silver', atomicNumber: 47, atomicMass: 107.87, group: 11, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s¹', description: 'Precious metal with highest electrical conductivity.', discoveryYear: -3000, discoveredBy: 'Ancient', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, atomicMass: 112.41, group: 12, period: 5, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s²', description: 'Toxic metal used in batteries.', discoveryYear: 1817, discoveredBy: 'Karl Samuel Leberecht Hermann', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'In', name: 'Indium', atomicNumber: 49, atomicMass: 114.82, group: 13, period: 5, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', description: 'Used in touchscreens and semiconductors.', discoveryYear: 1863, discoveredBy: 'Ferdinand Reich', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Sn', name: 'Tin', atomicNumber: 50, atomicMass: 118.71, group: 14, period: 5, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', description: 'Used in alloys and coatings.', discoveryYear: -3500, discoveredBy: 'Ancient', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Sb', name: 'Antimony', atomicNumber: 51, atomicMass: 121.76, group: 15, period: 5, category: 'Metalloid', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', description: 'Used in flame retardants and alloys.', discoveryYear: 1540, discoveredBy: 'Vannoccio Biringuccio', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'Te', name: 'Tellurium', atomicNumber: 52, atomicMass: 127.60, group: 16, period: 5, category: 'Metalloid', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', description: 'Used in solar panels and thermoelectrics.', discoveryYear: 1782, discoveredBy: 'Franz-Joseph Müller von Reichenstein', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'I', name: 'Iodine', atomicNumber: 53, atomicMass: 126.90, group: 17, period: 5, category: 'Halogen', state: 'solid', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', description: 'Essential for thyroid function.', discoveryYear: 1811, discoveredBy: 'Bernard Courtois', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, atomicMass: 131.29, group: 18, period: 5, category: 'Noble Gas', state: 'gas', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', description: 'Noble gas used in lighting and anesthesia.', discoveryYear: 1898, discoveredBy: 'William Ramsay', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },

  // Period 6
  { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, atomicMass: 132.91, group: 1, period: 6, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[Xe] 6s¹', description: 'Most reactive alkali metal, used in atomic clocks.', discoveryYear: 1860, discoveredBy: 'Robert Bunsen', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Ba', name: 'Barium', atomicNumber: 56, atomicMass: 137.33, group: 2, period: 6, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[Xe] 6s²', description: 'Used in medical imaging and fireworks.', discoveryYear: 1808, discoveredBy: 'Humphry Davy', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'La', name: 'Lanthanum', atomicNumber: 57, atomicMass: 138.91, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 5d¹ 6s²', description: 'First lanthanide, used in camera lenses.', discoveryYear: 1839, discoveredBy: 'Carl Gustaf Mosander', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Ce', name: 'Cerium', atomicNumber: 58, atomicMass: 140.12, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', description: 'Most abundant rare earth element.', discoveryYear: 1803, discoveredBy: 'Jöns Jacob Berzelius', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Pr', name: 'Praseodymium', atomicNumber: 59, atomicMass: 140.91, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f³ 6s²', description: 'Used in magnets and glass coloring.', discoveryYear: 1885, discoveredBy: 'Carl Auer von Welsbach', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Nd', name: 'Neodymium', atomicNumber: 60, atomicMass: 144.24, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁴ 6s²', description: 'Used in powerful permanent magnets.', discoveryYear: 1885, discoveredBy: 'Carl Auer von Welsbach', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Pm', name: 'Promethium', atomicNumber: 61, atomicMass: 145, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁵ 6s²', description: 'Radioactive element used in nuclear batteries.', discoveryYear: 1945, discoveredBy: 'Charles D. Coryell', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Sm', name: 'Samarium', atomicNumber: 62, atomicMass: 150.36, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁶ 6s²', description: 'Used in magnets and nuclear reactors.', discoveryYear: 1879, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Eu', name: 'Europium', atomicNumber: 63, atomicMass: 151.96, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁷ 6s²', description: 'Used in phosphors for TV screens.', discoveryYear: 1901, discoveredBy: 'Eugène-Anatole Demarçay', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Gd', name: 'Gadolinium', atomicNumber: 64, atomicMass: 157.25, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', description: 'Used in MRI contrast agents.', discoveryYear: 1880, discoveredBy: 'Jean Charles Galissard de Marignac', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Tb', name: 'Terbium', atomicNumber: 65, atomicMass: 158.93, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f⁹ 6s²', description: 'Used in green phosphors and magnets.', discoveryYear: 1843, discoveredBy: 'Carl Gustaf Mosander', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Dy', name: 'Dysprosium', atomicNumber: 66, atomicMass: 162.50, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹⁰ 6s²', description: 'Used in high-performance magnets.', discoveryYear: 1886, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Ho', name: 'Holmium', atomicNumber: 67, atomicMass: 164.93, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹¹ 6s²', description: 'Has the highest magnetic strength.', discoveryYear: 1878, discoveredBy: 'Per Teodor Cleve', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Er', name: 'Erbium', atomicNumber: 68, atomicMass: 167.26, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹² 6s²', description: 'Used in fiber optic amplifiers.', discoveryYear: 1843, discoveredBy: 'Carl Gustaf Mosander', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Tm', name: 'Thulium', atomicNumber: 69, atomicMass: 168.93, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹³ 6s²', description: 'Rarest stable rare earth element.', discoveryYear: 1879, discoveredBy: 'Per Teodor Cleve', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Yb', name: 'Ytterbium', atomicNumber: 70, atomicMass: 173.05, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 6s²', description: 'Used in atomic clocks and lasers.', discoveryYear: 1878, discoveredBy: 'Jean Charles Galissard de Marignac', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Lu', name: 'Lutetium', atomicNumber: 71, atomicMass: 174.97, group: 3, period: 6, category: 'Lanthanide', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', description: 'Last lanthanide, used in medical imaging.', discoveryYear: 1907, discoveredBy: 'Georges Urbain', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
  { symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, atomicMass: 178.49, group: 4, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', description: 'Used in nuclear reactor control rods.', discoveryYear: 1923, discoveredBy: 'Dirk Coster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, atomicMass: 180.95, group: 5, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', description: 'Highly corrosion-resistant, used in electronics.', discoveryYear: 1802, discoveredBy: 'Anders Gustaf Ekeberg', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'W', name: 'Tungsten', atomicNumber: 74, atomicMass: 183.84, group: 6, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', description: 'Highest melting point of all elements.', discoveryYear: 1783, discoveredBy: 'Juan José Elhuyar', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Re', name: 'Rhenium', atomicNumber: 75, atomicMass: 186.21, group: 7, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', description: 'One of the rarest elements on Earth.', discoveryYear: 1925, discoveredBy: 'Walter Noddack', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Os', name: 'Osmium', atomicNumber: 76, atomicMass: 190.23, group: 8, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', description: 'Densest naturally occurring element.', discoveryYear: 1803, discoveredBy: 'Smithson Tennant', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ir', name: 'Iridium', atomicNumber: 77, atomicMass: 192.22, group: 9, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', description: 'Most corrosion-resistant metal.', discoveryYear: 1803, discoveredBy: 'Smithson Tennant', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, atomicMass: 195.08, group: 10, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', description: 'Precious metal used in catalysts and jewelry.', discoveryYear: 1735, discoveredBy: 'Antonio de Ulloa', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Au', name: 'Gold', atomicNumber: 79, atomicMass: 196.97, group: 11, period: 6, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', description: 'Precious metal used in jewelry and electronics.', discoveryYear: -2600, discoveredBy: 'Ancient', color: 'bg-yellow-200 hover:bg-yellow-300 border-yellow-400' },
  { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, atomicMass: 200.59, group: 12, period: 6, category: 'Transition Metal', state: 'liquid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', description: 'Only metal that is liquid at room temperature.', discoveryYear: -1500, discoveredBy: 'Ancient', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Tl', name: 'Thallium', atomicNumber: 81, atomicMass: 204.38, group: 13, period: 6, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', description: 'Highly toxic metal once used in rat poison.', discoveryYear: 1861, discoveredBy: 'William Crookes', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Pb', name: 'Lead', atomicNumber: 82, atomicMass: 207.2, group: 14, period: 6, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', description: 'Heavy metal used in batteries and radiation shielding.', discoveryYear: -7000, discoveredBy: 'Ancient', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, atomicMass: 208.98, group: 15, period: 6, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', description: 'Used in cosmetics and low-melting alloys.', discoveryYear: 1753, discoveredBy: 'Claude François Geoffroy', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Po', name: 'Polonium', atomicNumber: 84, atomicMass: 209, group: 16, period: 6, category: 'Metalloid', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', description: 'Highly radioactive element discovered by Marie Curie.', discoveryYear: 1898, discoveredBy: 'Marie Curie', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'At', name: 'Astatine', atomicNumber: 85, atomicMass: 210, group: 17, period: 6, category: 'Halogen', state: 'solid', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', description: 'Rarest naturally occurring element.', discoveryYear: 1940, discoveredBy: 'Dale R. Corson', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Rn', name: 'Radon', atomicNumber: 86, atomicMass: 222, group: 18, period: 6, category: 'Noble Gas', state: 'gas', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', description: 'Radioactive noble gas, health hazard in homes.', discoveryYear: 1900, discoveredBy: 'Friedrich Ernst Dorn', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },

  // Period 7
  { symbol: 'Fr', name: 'Francium', atomicNumber: 87, atomicMass: 223, group: 1, period: 7, category: 'Alkali Metal', state: 'solid', electronConfiguration: '[Rn] 7s¹', description: 'Most unstable of the first 101 elements.', discoveryYear: 1939, discoveredBy: 'Marguerite Perey', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Ra', name: 'Radium', atomicNumber: 88, atomicMass: 226, group: 2, period: 7, category: 'Alkaline Earth Metal', state: 'solid', electronConfiguration: '[Rn] 7s²', description: 'Highly radioactive, once used in luminous paint.', discoveryYear: 1898, discoveredBy: 'Marie Curie', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'Ac', name: 'Actinium', atomicNumber: 89, atomicMass: 227, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 6d¹ 7s²', description: 'First actinide, highly radioactive.', discoveryYear: 1899, discoveredBy: 'André-Louis Debierne', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Th', name: 'Thorium', atomicNumber: 90, atomicMass: 232.04, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 6d² 7s²', description: 'Used in nuclear reactors and gas mantles.', discoveryYear: 1828, discoveredBy: 'Jöns Jacob Berzelius', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, atomicMass: 231.04, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f² 6d¹ 7s²', description: 'Rare radioactive metal with no commercial uses.', discoveryYear: 1913, discoveredBy: 'Kasimir Fajans', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'U', name: 'Uranium', atomicNumber: 92, atomicMass: 238.03, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', description: 'Used in nuclear power and weapons.', discoveryYear: 1789, discoveredBy: 'Martin Heinrich Klaproth', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Np', name: 'Neptunium', atomicNumber: 93, atomicMass: 237, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', description: 'First transuranium element synthesized.', discoveryYear: 1940, discoveredBy: 'Edwin McMillan', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, atomicMass: 244, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f⁶ 7s²', description: 'Used in nuclear weapons and reactors.', discoveryYear: 1940, discoveredBy: 'Glenn T. Seaborg', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Am', name: 'Americium', atomicNumber: 95, atomicMass: 243, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f⁷ 7s²', description: 'Used in smoke detectors.', discoveryYear: 1944, discoveredBy: 'Glenn T. Seaborg', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Cm', name: 'Curium', atomicNumber: 96, atomicMass: 247, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', description: 'Named after Marie and Pierre Curie.', discoveryYear: 1944, discoveredBy: 'Glenn T. Seaborg', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, atomicMass: 247, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f⁹ 7s²', description: 'Named after Berkeley, California.', discoveryYear: 1949, discoveredBy: 'Glenn T. Seaborg', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Cf', name: 'Californium', atomicNumber: 98, atomicMass: 251, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹⁰ 7s²', description: 'Used in neutron sources and nuclear reactors.', discoveryYear: 1950, discoveredBy: 'Glenn T. Seaborg', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, atomicMass: 252, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹¹ 7s²', description: 'Named after Albert Einstein.', discoveryYear: 1952, discoveredBy: 'Albert Ghiorso', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Fm', name: 'Fermium', atomicNumber: 100, atomicMass: 257, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹² 7s²', description: 'Named after Enrico Fermi.', discoveryYear: 1952, discoveredBy: 'Albert Ghiorso', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, atomicMass: 258, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹³ 7s²', description: 'Named after Dmitri Mendeleev.', discoveryYear: 1955, discoveredBy: 'Albert Ghiorso', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'No', name: 'Nobelium', atomicNumber: 102, atomicMass: 259, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 7s²', description: 'Named after Alfred Nobel.', discoveryYear: 1957, discoveredBy: 'Albert Ghiorso', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, atomicMass: 266, group: 3, period: 7, category: 'Actinide', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹ 7s²', description: 'Last actinide, named after Ernest Lawrence.', discoveryYear: 1961, discoveredBy: 'Albert Ghiorso', color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
  { symbol: 'Rf', name: 'Rutherfordium', atomicNumber: 104, atomicMass: 267, group: 4, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', description: 'Named after Ernest Rutherford.', discoveryYear: 1964, discoveredBy: 'Albert Ghiorso', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Db', name: 'Dubnium', atomicNumber: 105, atomicMass: 268, group: 5, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', description: 'Named after Dubna, Russia.', discoveryYear: 1967, discoveredBy: 'Albert Ghiorso', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Sg', name: 'Seaborgium', atomicNumber: 106, atomicMass: 269, group: 6, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', description: 'Named after Glenn T. Seaborg.', discoveryYear: 1974, discoveredBy: 'Albert Ghiorso', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Bh', name: 'Bohrium', atomicNumber: 107, atomicMass: 270, group: 7, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', description: 'Named after Niels Bohr.', discoveryYear: 1981, discoveredBy: 'Peter Armbruster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Hs', name: 'Hassium', atomicNumber: 108, atomicMass: 277, group: 8, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', description: 'Named after Hesse, Germany.', discoveryYear: 1984, discoveredBy: 'Peter Armbruster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Mt', name: 'Meitnerium', atomicNumber: 109, atomicMass: 278, group: 9, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', description: 'Named after Lise Meitner.', discoveryYear: 1982, discoveredBy: 'Peter Armbruster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Ds', name: 'Darmstadtium', atomicNumber: 110, atomicMass: 281, group: 10, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', description: 'Named after Darmstadt, Germany.', discoveryYear: 1994, discoveredBy: 'Peter Armbruster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Rg', name: 'Roentgenium', atomicNumber: 111, atomicMass: 282, group: 11, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', description: 'Named after Wilhelm Röntgen.', discoveryYear: 1994, discoveredBy: 'Peter Armbruster', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Cn', name: 'Copernicium', atomicNumber: 112, atomicMass: 285, group: 12, period: 7, category: 'Transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', description: 'Named after Nicolaus Copernicus.', discoveryYear: 1996, discoveredBy: 'Sigurd Hofmann', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { symbol: 'Nh', name: 'Nihonium', atomicNumber: 113, atomicMass: 286, group: 13, period: 7, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', description: 'Named after Japan (Nihon).', discoveryYear: 2004, discoveredBy: 'RIKEN', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Fl', name: 'Flerovium', atomicNumber: 114, atomicMass: 289, group: 14, period: 7, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', description: 'Named after Georgy Flyorov.', discoveryYear: 1999, discoveredBy: 'Joint Institute for Nuclear Research', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Mc', name: 'Moscovium', atomicNumber: 115, atomicMass: 290, group: 15, period: 7, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', description: 'Named after Moscow region.', discoveryYear: 2003, discoveredBy: 'Joint Institute for Nuclear Research', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Lv', name: 'Livermorium', atomicNumber: 116, atomicMass: 293, group: 16, period: 7, category: 'Post-transition Metal', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', description: 'Named after Livermore, California.', discoveryYear: 2000, discoveredBy: 'Joint Institute for Nuclear Research', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Ts', name: 'Tennessine', atomicNumber: 117, atomicMass: 294, group: 17, period: 7, category: 'Halogen', state: 'solid', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', description: 'Named after Tennessee.', discoveryYear: 2010, discoveredBy: 'Joint Institute for Nuclear Research', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Og', name: 'Oganesson', atomicNumber: 118, atomicMass: 294, group: 18, period: 7, category: 'Noble Gas', state: 'unknown', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', description: 'Named after Yuri Oganessian, completes period 7.', discoveryYear: 2002, discoveredBy: 'Joint Institute for Nuclear Research', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' }
];

interface FullPeriodicTableProps {
  onElementSelect: (element: Element) => void;
  className?: string;
}

export const FullPeriodicTable = ({ onElementSelect, className }: FullPeriodicTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const categories = ['All', 'Alkali Metal', 'Alkaline Earth Metal', 'Transition Metal', 'Post-transition Metal', 'Metalloid', 'Nonmetal', 'Halogen', 'Noble Gas', 'Lanthanide', 'Actinide'];
  const states = ['All', 'solid', 'liquid', 'gas', 'unknown'];
  const periods = ['All', '1', '2', '3', '4', '5', '6', '7'];

  const filteredElements = useMemo(() => {
    return periodicElements.filter(element => {
      const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           element.atomicNumber.toString().includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || element.category === selectedCategory;
      const matchesState = selectedState === 'All' || element.state === selectedState;
      const matchesPeriod = selectedPeriod === 'All' || element.period.toString() === selectedPeriod;
      
      return matchesSearch && matchesCategory && matchesState && matchesPeriod;
    });
  }, [searchTerm, selectedCategory, selectedState, selectedPeriod]);

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

  const handleElementDrag = (element: Element) => {
    onElementSelect(element);
    toast.success(`${element.name} added to canvas!`);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredElements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'periodic-table-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Periodic table data exported!");
  };

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Elements</h3>
            <p className="text-xs text-muted-foreground">All 118 elements • Click to add</p>
          </div>
          <Button onClick={exportData} variant="outline" size="sm" className="interactive">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2 py-1 rounded border bg-background"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs px-2 py-1 rounded border bg-background"
            >
              {states.map(state => (
                <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
              ))}
            </select>
            
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs px-2 py-1 rounded border bg-background"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period === 'All' ? 'All Periods' : `Period ${period}`}</option>
              ))}
            </select>
          </div>
        </div>

        <Separator />
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="grid grid-cols-6 gap-2 pb-4">
            {filteredElements.map((element) => (
              <Card
                key={element.symbol}
                className={`
                  p-2 cursor-pointer transition-all duration-200 
                  ${element.color} border interactive
                  hover:scale-105 hover:shadow-soft
                  active:scale-95
                `}
                onClick={() => handleElementClick(element)}
                onDoubleClick={() => handleElementDrag(element)}
                draggable
                onDragStart={() => handleElementDrag(element)}
                title={`Click to add ${element.name} to canvas`}
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {element.atomicNumber}
                  </div>
                  <div className="text-lg font-bold text-foreground mb-1">
                    {element.symbol}
                  </div>
                  <div className="text-xs text-foreground truncate mb-1">
                    {element.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {element.atomicMass.toFixed(2)}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {element.state}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredElements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No elements match your search criteria</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Element Details Dialog */}
      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${selectedElement?.color}`}>
                <span className="text-xs text-muted-foreground">{selectedElement?.atomicNumber}</span>
                <span className="text-xl font-bold">{selectedElement?.symbol}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedElement?.name}</h3>
                <p className="text-sm text-muted-foreground">Atomic Number {selectedElement?.atomicNumber}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedElement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atomic Mass</p>
                  <p className="text-lg font-semibold">{selectedElement.atomicMass}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="secondary">{selectedElement.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Group</p>
                  <p className="text-lg font-semibold">{selectedElement.group}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Period</p>
                  <p className="text-lg font-semibold">{selectedElement.period}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">State</p>
                  <Badge variant="outline">{selectedElement.state}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discovery</p>
                  <p className="text-sm">{selectedElement.discoveryYear}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Electron Configuration</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedElement.electronConfiguration}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm text-foreground">{selectedElement.description}</p>
              </div>

              {selectedElement.discoveredBy && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Discovered By</p>
                  <p className="text-sm text-foreground">{selectedElement.discoveredBy}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => handleElementDrag(selectedElement)}
                  className="flex-1 bg-gradient-primary"
                >
                  Add to Canvas
                </Button>
                <Button 
                  onClick={() => setSelectedElement(null)}
                  variant="outline"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};