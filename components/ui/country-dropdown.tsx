"use client";
import React, { useCallback, useState, forwardRef, useEffect } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckIcon } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { countries } from "country-data-list";

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  t: (key: string) => string;
  error?: boolean;
  required?: boolean;
}

const CountryDropdownComponent = (
  {
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Country",
    t,
    error,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );

  // Custom country objects for UK nations and Ireland
  const options: Country[] = [
    {
      alpha2: "gb-eng",
      alpha3: "ENG",
      countryCallingCodes: ["+44"],
      currencies: ["GBP"],
      ioc: "GBR",
      languages: ["en"],
      name: "England",
      status: "assigned"
    },
    {
      alpha2: "gb-wls",
      alpha3: "WLS",
      countryCallingCodes: ["+44"],
      currencies: ["GBP"],
      ioc: "GBR",
      languages: ["en", "cy"],
      name: "Wales",
      status: "assigned"
    },
    {
      alpha2: "gb-sct",
      alpha3: "SCT",
      countryCallingCodes: ["+44"],
      currencies: ["GBP"],
      ioc: "GBR",
      languages: ["en", "gd"],
      name: "Scotland",
      status: "assigned"
    },
    {
      alpha2: "gb-nir",
      alpha3: "NIR",
      countryCallingCodes: ["+44"],
      currencies: ["GBP"],
      ioc: "GBR",
      languages: ["en", "ga"],
      name: "Northern Ireland",
      status: "assigned"
    }
  ];

  useEffect(() => {
    // If we have a defaultValue, try to find the country by alpha3 code or by name
    if (defaultValue) {
      const initialCountry = options.find(
        (country) => country.alpha3 === defaultValue || country.name === defaultValue
      );
      
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      }
      // No default selection if the country is not found
    }
    // No default selection if no defaultValue is provided
  }, [defaultValue]); // Removed options from dependency array as it's defined in the component

  const handleSelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-[#81D4FA] bg-white px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-[#0288d1] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          error && "border-red-500"
        )}
        disabled={disabled}
        required={props.required}
        {...props}
      >
        {selectedCountry ? (
          <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
              <CircleFlag
                countryCode={selectedCountry.alpha2.toLowerCase()}
                height={20}
              />
            </div>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedCountry.name}
            </span>
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0 bg-white"
      >
        <Command className="w-full bg-white">
          <CommandList>
            <CommandGroup>
              {options.map((option, key: number) => (
                <CommandItem
                  className="flex items-center w-full gap-2"
                  key={key}
                  onSelect={() => handleSelect(option)}
                >
                  <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
                    <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                      <CircleFlag
                        countryCode={option.alpha2.toLowerCase()}
                        height={20}
                      />
                    </div>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {option.name}
                    </span>
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      option.name === selectedCountry?.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
