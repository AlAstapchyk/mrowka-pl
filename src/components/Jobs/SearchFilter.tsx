'use client';

import React, { useEffect, useState } from 'react';
import { useJobSearch } from '@/hooks/useJobSearch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { EmploymentType, JobLevel, WorkingMode } from '@/db/schema';
import { EMPLOYMENT_TYPES, JOB_LEVELS, WORKING_MODES } from '@/mapping';

const SearchFilter = () => {
  const { params, updateParams } = useJobSearch();

  const [jobLevel, setJobLevel] = useState<JobLevel[]>(params.jobLevel || []);
  const [workingMode, setWorkingMode] = useState<WorkingMode[]>(params.workingMode || []);
  const [employmentType, setEmploymentType] = useState<EmploymentType[]>(params.employmentType || []);
  const [minSalary, setMinSalary] = useState<number | string>(params.minSalary || 0);

  useEffect(() => {
    setJobLevel(params.jobLevel || []);
    setWorkingMode(params.workingMode || []);
    setEmploymentType(params.employmentType || []);
    setMinSalary(params.minSalary || '');
  }, []);

  const handleJobLevelChange = (level: string, checked: boolean) => {
    setJobLevel(prev =>
      checked ? [...prev, level] as JobLevel[] : prev.filter(l => l !== level)
    );
  };

  const handleWorkingModeChange = (mode: string, checked: boolean) => {
    setWorkingMode(prev =>
      checked ? [...prev, mode] as WorkingMode[] : prev.filter(m => m !== mode)
    );
  };

  const handleEmploymentTypeChange = (type: string, checked: boolean) => {
    setEmploymentType(prev =>
      checked ? [...prev, type] as EmploymentType[] : prev.filter(t => t !== type)
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
  };

  return (
    <div className="w-60 border rounded-xl mt-4 mb-8 border-black">
      <header className="px-6 py-4 border-b border-black">
        <p className='text-xl font-semibold'>Filters</p>
      </header>
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Job Level</h3>
          <div className="space-y-2">
            {JOB_LEVELS.map((level) => (
              <div key={level.id} className="flex items-center">
                <Checkbox
                  id={`job-level-${level.id}`}
                  className='cursor-pointer'
                  checked={jobLevel.includes(level.id as JobLevel)}
                  onCheckedChange={(checked) =>
                    handleJobLevelChange(level.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`job-level-${level.id}`}
                  className="text-sm font-normal pl-2 flex cursor-pointer"
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
              value={minSalary || ''}
              onChange={handleMinSalaryChange}
              className="h-8 w-24"
            />
            <span className="text-sm">zł</span>
          </div>
        </div>

        <hr />

        <div className="space-y-2">
          <h3 className="font-semibold">Working Mode</h3>
          <div className="space-y-2">
            {WORKING_MODES.map((mode) => (
              <div key={mode.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`working-mode-${mode.id}`}
                  checked={workingMode.includes(mode.id as WorkingMode)}
                  className='cursor-pointer'
                  onCheckedChange={(checked) =>
                    handleWorkingModeChange(mode.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`working-mode-${mode.id}`}
                  className="text-sm font-normal cursor-pointer"
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
          <div className="space-y-2">
            {EMPLOYMENT_TYPES.map((employment) => (
              <div key={employment.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`employment-type-${employment.id}`}
                  checked={employmentType.includes(employment.id as EmploymentType)}
                  className='cursor-pointer'
                  onCheckedChange={(checked) =>
                    handleEmploymentTypeChange(employment.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`employment-type-${employment.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {employment.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className='mx-auto flex'
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilter;