'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  ChevronDown,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CURRENCIES, getCurrencyByCode, CurrencyInfo } from '@/lib/utils/currencies';

interface Currency {
  currency: string;
  code: string;
  flag: string;
  buyRate: string;
  sellRate: string;
  change?: string;
}

interface ExchangeRatesContent {
  title?: string;
  description?: string;
  currencies: Currency[];
}

interface ExchangeRatesEditorProps {
  content: ExchangeRatesContent;
  onChange: (content: ExchangeRatesContent) => void;
  businessId?: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export function ExchangeRatesEditor({
  content,
  onChange,
  businessId,
  onSave,
  isSaving = false
}: ExchangeRatesEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currencySearch, setCurrencySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state for new/edit currency
  const [formData, setFormData] = useState<Currency>({
    currency: '',
    code: '',
    flag: '',
    buyRate: '',
    sellRate: '',
    change: ''
  });

  // Filter currencies based on search
  const filteredCurrencies = useMemo(() => {
    if (!currencySearch.trim()) return CURRENCIES.slice(0, 50); // Show first 50 when no search
    const search = currencySearch.toLowerCase();
    return CURRENCIES.filter(c => 
      c.code.toLowerCase().includes(search) ||
      c.name.toLowerCase().includes(search)
    ).slice(0, 100); // Limit to 100 results
  }, [currencySearch]);

  // Handle currency selection from dropdown
  const handleCurrencySelect = (currency: CurrencyInfo) => {
    setFormData({
      ...formData,
      code: currency.code,
      currency: currency.name,
      flag: currency.flag
    });
    setCurrencySearch('');
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrencySearch(value);
    // Open dropdown when user types
    if (value.trim()) {
      setIsDropdownOpen(true);
    }
    setHighlightedIndex(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filteredCurrencies.length - 1));
      setIsDropdownOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCurrencies[highlightedIndex]) {
      e.preventDefault();
      handleCurrencySelect(filteredCurrencies[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  const updateField = (field: keyof ExchangeRatesContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const openAddDialog = () => {
    setFormData({
      currency: '',
      code: '',
      flag: '',
      buyRate: '',
      sellRate: '',
      change: ''
    });
    setCurrencySearch('');
    setEditingIndex(null);
    setIsDropdownOpen(false);
    setHighlightedIndex(0);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const currency = content.currencies[index];
    const currencyInfo = currency.code ? getCurrencyByCode(currency.code) : null;
    setFormData({
      currency: currency.currency || currencyInfo?.name || '',
      code: currency.code || '',
      flag: currency.flag || currencyInfo?.flag || '',
      buyRate: currency.buyRate || '',
      sellRate: currency.sellRate || '',
      change: currency.change || ''
    });
    setCurrencySearch(currencyInfo?.name || currency.currency || '');
    setEditingIndex(index);
    setIsDropdownOpen(false);
    setHighlightedIndex(0);
    setIsDialogOpen(true);
  };

  const saveCurrency = () => {
    if (!formData.currency || !formData.code || !formData.buyRate || !formData.sellRate) {
      alert('Please fill in all required fields: Currency Name, Code, Buy Rate, and Sell Rate');
      return;
    }

    const currencies = [...(content.currencies || [])];
    
    if (editingIndex !== null) {
      // Update existing currency
      currencies[editingIndex] = { ...formData };
    } else {
      // Add new currency
      currencies.push({ ...formData });
    }

    updateField('currencies', currencies);
    setIsDialogOpen(false);
    setEditingIndex(null);
  };

  const deleteCurrency = (index: number) => {
    if (confirm('Are you sure you want to delete this currency?')) {
      const currencies = [...(content.currencies || [])];
      currencies.splice(index, 1);
      updateField('currencies', currencies);
    }
  };

  const currencies = content.currencies || [];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Exchange Rates Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Section Title</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Today's Rates"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Competitive foreign exchange rates available at all our bureau locations..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Currencies List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Currencies ({currencies.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Currency
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingIndex !== null ? 'Edit Currency' : 'Add New Currency'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Combined Currency Search & Dropdown */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Select Currency <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Combined Search/Dropdown Component */}
                    <div ref={comboboxRef} className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                        <Input
                          ref={inputRef}
                          value={currencySearch}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDropdownOpen) {
                              setIsDropdownOpen(true);
                            }
                          }}
                          placeholder="Search all world currencies (e.g., USD, Dollar, Euro, Yen)..."
                          className="pl-10 pr-10 h-11 cursor-text"
                          readOnly={false}
                        />
                        {currencySearch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrencySearch('');
                              setIsDropdownOpen(false);
                              inputRef.current?.focus();
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {!currencySearch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen(prev => !prev);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                          >
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                        )}
                      </div>

                      {/* Dropdown Results */}
                      {isDropdownOpen && (
                        <div 
                          ref={dropdownRef}
                          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[320px] overflow-y-auto"
                        >
                          {filteredCurrencies.length > 0 ? (
                            <>
                              {filteredCurrencies.map((curr, index) => (
                                <button
                                  key={`${curr.code}-${index}`}
                                  type="button"
                                  onClick={() => handleCurrencySelect(curr)}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                    index === highlightedIndex ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                                  } ${formData.code === curr.code ? 'bg-green-50' : ''}`}
                                >
                                  <span className="text-2xl flex-shrink-0">{curr.flag}</span>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm text-gray-900">{curr.name}</span>
                                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                        {curr.code}
                                      </span>
                                    </div>
                                  </div>
                                  {formData.code === curr.code && (
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  )}
                                </button>
                              ))}
                              {filteredCurrencies.length >= 100 && (
                                <div className="px-4 py-2 text-xs text-gray-500 text-center border-t">
                                  Showing first 100 results. Narrow your search for more specific results.
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-gray-500 mb-1">No currencies found</p>
                              <p className="text-xs text-gray-400">Try searching with a different term</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Search Results Count */}
                      {currencySearch && filteredCurrencies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1.5 px-1">
                          {filteredCurrencies.length} {filteredCurrencies.length === 1 ? 'currency' : 'currencies'} found
                        </p>
                      )}
                    </div>
                    
                    {/* Selected Currency Preview */}
                    {formData.code && formData.flag && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-blue-100">
                          <span className="text-3xl">{formData.flag}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{formData.currency}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Currency Code: <span className="font-mono font-medium text-gray-800">{formData.code}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, code: '', currency: '', flag: '' });
                            setCurrencySearch('');
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Buy Rate <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.buyRate}
                        onChange={(e) => setFormData({ ...formData, buyRate: e.target.value })}
                        placeholder="19.50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Rate at which you buy this currency
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sell Rate <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.sellRate}
                        onChange={(e) => setFormData({ ...formData, sellRate: e.target.value })}
                        placeholder="19.80"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Rate at which you sell this currency
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Change (Optional)
                    </label>
                    <Input
                      value={formData.change || ''}
                      onChange={(e) => setFormData({ ...formData, change: e.target.value })}
                      placeholder="+0.15"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Change indicator (e.g., +0.15, -0.12)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveCurrency}>
                    {editingIndex !== null ? 'Update Currency' : 'Add Currency'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {currencies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No currencies added yet. Click "Add Currency" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currencies.map((currency, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{currency.flag || '💰'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{currency.currency}</h4>
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                              {currency.code}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <span className="text-xs text-gray-500">Buy Rate</span>
                              <p className="font-semibold text-green-600">{currency.buyRate}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Sell Rate</span>
                              <p className="font-semibold text-amber-600">{currency.sellRate}</p>
                            </div>
                            {currency.change && (
                              <div className="col-span-2">
                                <span className="text-xs text-gray-500">Change</span>
                                <p className={`font-semibold ${
                                  currency.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {currency.change}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCurrency(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Exchange Rates'}
          </Button>
        </div>
      )}
    </div>
  );
}

