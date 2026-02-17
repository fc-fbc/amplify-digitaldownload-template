"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Film, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFilmSearch } from "@/lib/hooks/useFilmSearch";
import { CatalogTitle } from "@/lib/types/catalog";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface FilmSearchInputProps {
  value: string;
  year: number;
  posterPath?: string;
  mediaType?: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD";
  onChange: (value: string) => void;
  onSelect: (film: CatalogTitle) => void;
  onManualEntry: (title: string, year: number) => void;
  onClear: () => void;
  error?: boolean;
}

export function FilmSearchInput({
  value,
  year,
  posterPath,
  mediaType,
  onChange,
  onSelect,
  onManualEntry,
  onClear,
  error = false,
}: FilmSearchInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualYear, setManualYear] = useState("");
  const [manualYearError, setManualYearError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  // Only consider "selected" if we have a title and a valid year (actual film selection, not just typing)
  const isSelected = !!(value && year > 1900);
  const searchTerm = query.replace(/\s*\(\d{4}\)\s*$/, "").trim();
  const { results, isLoading } = useFilmSearch(isSelected ? "" : query);

  // Sync with props
  useEffect(() => {
    if (value && year > 0) {
      setQuery(`${value} (${year})`);
    } else if (!value) {
      setQuery("");
    }
  }, [value, year]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setManualMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setManualMode(false);
    setManualYear("");

    if (isSelected) {
      onClear();
    }

    onChange(val.replace(/\s*\(\d{4}\)\s*$/, ""));
    setIsOpen(val.length >= 2);
  }, [isSelected, onChange, onClear]);

  const handleSelect = useCallback((film: CatalogTitle) => {
    setQuery(`${film.title} (${film.year})`);
    setIsOpen(false);
    setManualMode(false);
    onSelect(film);
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    setManualMode(false);
    setManualYear("");
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  const handleManualSubmit = useCallback(() => {
    const title = searchTerm;
    const yearNum = parseInt(manualYear);

    if (!title) return;
    if (!/^\d{4}$/.test(manualYear)) {
      setManualYearError("Enter a valid 4-digit year");
      return;
    }
    if (yearNum < 1888 || yearNum > new Date().getFullYear() + 5) {
      setManualYearError("Enter a year between 1888 and " + (new Date().getFullYear() + 5));
      return;
    }

    setQuery(`${title} (${manualYear})`);
    setIsOpen(false);
    setManualMode(false);
    setManualYearError("");
    onManualEntry(title, yearNum);
  }, [searchTerm, manualYear, onManualEntry]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: isOpen && !isSelected ? '450px' : 'auto' }}>
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t('form.filmScreenings.filmTitle')} <span className="text-red-500">*</span>
      </label>

      {/* Selected Film Card */}
      {isSelected && (
        <div className="mb-4 p-3 bg-green-50 border-2 border-green-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            {/* Poster - fixed small size */}
            <div className="w-12 h-16 rounded overflow-hidden bg-gray-200 flex-shrink-0 shadow">
              {posterPath ? (
                <Image
                  src={`/api/Images/${posterPath}`}
                  alt={value}
                  width={48}
                  height={64}
                  className="object-cover"
                  style={{ width: '48px', height: '64px' }}
                  unoptimized
                />
              ) : (
                <div className="w-12 h-16 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Film className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">{value}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">{year}</p>
                {mediaType && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    mediaType === "DIGITAL_DOWNLOAD"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {mediaType === "DIGITAL_DOWNLOAD" ? "Digital Download" : "Special Permission"}
                  </span>
                )}
              </div>
            </div>

            {/* Status & Clear */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Selected
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClear}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      {!isSelected && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
          {isLoading && (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
                setManualMode(false);
              }
              if (e.key === "Enter" && results.length === 1) {
                e.preventDefault();
                handleSelect(results[0]);
              }
            }}
            placeholder="Search for a film title..."
            className={`w-full h-12 pl-12 pr-12 text-base bg-white border-2 rounded-lg shadow-sm transition-all
              ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}
              focus:outline-none focus:ring-2`}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && !isSelected && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-2xl overflow-hidden" style={{ maxHeight: '400px' }}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Search className="w-4 h-4" />
              {isLoading ? (
                <span>Searching...</span>
              ) : results.length > 0 ? (
                <span>{results.length} results for "{searchTerm}"</span>
              ) : searchTerm.length >= 2 ? (
                <span>No results for "{searchTerm}"</span>
              ) : (
                <span>Type to search</span>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Searching catalog...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((film, index) => (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() => handleSelect(film)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all
                      hover:bg-blue-50 hover:shadow-md
                      ${index !== results.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {/* Poster */}
                    <div className="w-10 h-14 rounded overflow-hidden bg-gray-200 flex-shrink-0 shadow">
                      {film.posterPath ? (
                        <Image
                          src={`/api/Images/${film.posterPath}`}
                          alt={film.title}
                          width={40}
                          height={56}
                          className="object-cover"
                          style={{ width: '40px', height: '56px' }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-14 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Film className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate">{film.title}</p>
                      <p className="text-sm text-gray-600 font-medium">{film.year}</p>
                    </div>

                    {/* Badge */}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                      film.mediaType === "DIGITAL_DOWNLOAD"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {film.mediaType === "DIGITAL_DOWNLOAD" ? "Digital" : "Special"}
                    </span>
                  </button>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Film className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">No films found</p>
                <p className="text-sm text-gray-500 mb-4">We couldn't find "{searchTerm}" in our catalog</p>
              </div>
            ) : null}
          </div>

          {/* Manual Entry Section */}
          {searchTerm.length >= 2 && (
            <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
              {manualMode ? (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-700">
                    Add "{searchTerm}" manually:
                  </p>
                  <div className="flex gap-3">
                    <input
                      ref={yearInputRef}
                      type="text"
                      placeholder="Release Year (e.g. 2023)"
                      value={manualYear}
                      onChange={(e) => {
                        setManualYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                        setManualYearError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                      className={`flex-1 h-12 px-4 text-base border-2 rounded-lg ${
                        manualYearError ? "border-red-400" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
                      autoFocus
                    />
                    <Button
                      type="button"
                      onClick={handleManualSubmit}
                      disabled={!manualYear || manualYear.length !== 4}
                      className="h-12 px-6 font-semibold"
                    >
                      Add Film
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setManualMode(false);
                        setManualYear("");
                        setManualYearError("");
                      }}
                      className="h-12 px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                  {manualYearError && (
                    <p className="text-sm text-red-600 font-medium">{manualYearError}</p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setManualMode(true);
                    setTimeout(() => yearInputRef.current?.focus(), 50);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-base font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Can't find your film? Add it manually
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!isSelected && (
        <p className="mt-2 text-sm text-gray-500">
          Only Digital Download titles are available to search here.
        </p>
      )}
    </div>
  );
}
