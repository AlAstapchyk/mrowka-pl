"use client";

import React, { useEffect, useState } from "react";
import { useJobSearch } from "@/hooks/useJobSearch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { EmploymentType, JobLevel, WorkingMode } from "@/db/schema";
import { EMPLOYMENT_TYPES, JOB_LEVELS, WORKING_MODES } from "@/mapping";
import { Filter, X } from "lucide-react";

const SearchFilter = () => {
  const { params, updateParams } = useJobSearch();
  const [isOpen, setIsOpen] = useState(false);

  const [jobLevel, setJobLevel] = useState<JobLevel[]>(params.jobLevel || []);
  const [workingMode, setWorkingMode] = useState<WorkingMode[]>(
    params.workingMode || [],
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType[]>(
    params.employmentType || [],
  );
  const [minSalary, setMinSalary] = useState<number | string>(
    params.minSalary || 0,
  );

  useEffect(() => {
    setJobLevel(params.jobLevel || []);
    setWorkingMode(params.workingMode || []);
    setEmploymentType(params.employmentType || []);
    setMinSalary(params.minSalary || "");
  }, []);

  const handleJobLevelChange = (level: string, checked: boolean) => {
    setJobLevel((prev) =>
      checked
        ? ([...prev, level] as JobLevel[])
        : prev.filter((l) => l !== level),
    );
  };

  const handleWorkingModeChange = (mode: string, checked: boolean) => {
    setWorkingMode((prev) =>
      checked
        ? ([...prev, mode] as WorkingMode[])
        : prev.filter((m) => m !== mode),
    );
  };

  const handleEmploymentTypeChange = (type: string, checked: boolean) => {
    setEmploymentType((prev) =>
      checked
        ? ([...prev, type] as EmploymentType[])
        : prev.filter((t) => t !== type),
    );
  };

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinSalary(e.target.value);
  };

  const handleSearch = () => {
    updateParams({
      ...params,
      jobLevel,
      workingMode,
      employmentType,
      minSalary: Number(minSalary),
    });
    // Close mobile filter on apply
    setIsOpen(false);
  };

  const clearFilters = () => {
    setJobLevel([]);
    setWorkingMode([]);
    setEmploymentType([]);
    setMinSalary("");
    updateParams({
      ...params,
      jobLevel: [],
      workingMode: [],
      employmentType: [],
      minSalary: 0,
    });
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    return jobLevel.length + workingMode.length + employmentType.length + (minSalary ? 1 : 0);
  };

  const FilterContent = () => (
    <>
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Job Level</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {JOB_LEVELS.map((level) => (
              <div key={level.id} className="flex items-center">
                <Checkbox
                  id={`job-level-${level.id}`}
                  className="cursor-pointer"
                  checked={jobLevel.includes(level.id as JobLevel)}
                  onCheckedChange={(checked) =>
                    handleJobLevelChange(level.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`job-level-${level.id}`}
                  className="flex cursor-pointer pl-2 text-sm font-normal"
                >
                  {level.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <hr />

        <div className="space-y-2">
          <h3 className="font-semibold">Salary</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm">From</span>
            <Input
              type="number"
              value={minSalary || ""}
              onChange={handleMinSalaryChange}
              className="h-8 w-24"
            />
            <span className="text-sm">zł</span>
          </div>
        </div>

        <hr />

        <div className="space-y-2">
          <h3 className="font-semibold">Working Mode</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {WORKING_MODES.map((mode) => (
              <div key={mode.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`working-mode-${mode.id}`}
                  checked={workingMode.includes(mode.id as WorkingMode)}
                  className="cursor-pointer"
                  onCheckedChange={(checked) =>
                    handleWorkingModeChange(mode.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`working-mode-${mode.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {mode.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <hr />

        <div className="space-y-2">
          <h3 className="font-semibold">Type of Contract</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {EMPLOYMENT_TYPES.map((employment) => (
              <div key={employment.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`employment-type-${employment.id}`}
                  checked={employmentType.includes(
                    employment.id as EmploymentType,
                  )}
                  className="cursor-pointer"
                  onCheckedChange={(checked) =>
                    handleEmploymentTypeChange(
                      employment.id,
                      checked as boolean,
                    )
                  }
                />
                <Label
                  htmlFor={`employment-type-${employment.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {employment.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            Apply filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex-1"
          >
            Clear
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 lg:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filter Sidebar */}
      <div className="hidden w-60 rounded-xl border border-black lg:block">
        <header className="border-b border-black px-6 py-4">
          <p className="text-xl font-semibold">Filters</p>
        </header>
        <FilterContent />
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)} // Click on background closes modal
        >
          <div
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <p className="text-xl font-semibold">Filters</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            </header>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Overlay background for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SearchFilter;