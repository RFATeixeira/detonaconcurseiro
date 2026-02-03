'use client';

import { useState } from 'react';
import { useConcursosData } from '@/lib/use-concursos-data';

interface AddConcursoDataFormProps {
  onSuccess?: () => void;
}

export default function AddConcursoDataForm({ onSuccess }: AddConcursoDataFormProps) {
  const { adicionarConcursoData, loading, error } = useConcursosData();
  const [formData, setFormData] = useState({
    nomeConcurso: '',
    banca: '',
    cargo: '',
    salario: '',
    dataProva: '',
    dataFinalInscricao: '',
    dataEncerramento: '',
    edital: '',
    descricao: '',
  });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setNomeArquivo(file.name);
    }
  };

  const removerArquivo = () => {
    setArquivo(null);
    setNomeArquivo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Validação básica
    if (!formData.nomeConcurso || !formData.banca || !formData.cargo || !formData.dataProva || !formData.dataFinalInscricao || !formData.dataEncerramento) {
      setSubmitError('Preencha todos os campos obrigatórios: Nome, Banca, Cargo, Data da Prova, Data Final Inscrição e Data de Encerramento');
      return;
    }

    try {
      await adicionarConcursoData(
        formData.nomeConcurso,
        formData.banca,
        formData.cargo,
        formData.salario,
        formData.dataProva,
        formData.dataFinalInscricao,
        formData.dataEncerramento,
        formData.edital,
        formData.descricao
      );

      setFormData({
        nomeConcurso: '',
        banca: '',
        cargo: '',
        salario: '',
        dataProva: '',
        dataFinalInscricao: '',
        dataEncerramento: '',
        edital: '',
        descricao: '',
      });
      setArquivo(null);
      setNomeArquivo('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao adicionar concurso');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Adicionar Novo Concurso</h2>

      {/* Nome do Concurso */}
      <div>
        <label htmlFor="nomeConcurso" className="block text-sm font-medium text-gray-300">
          Nome do Concurso *
        </label>
        <input
          type="text"
          id="nomeConcurso"
          name="nomeConcurso"
          value={formData.nomeConcurso}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="Ex: INSS 2024"
          required
        />
      </div>

      {/* Banca */}
      <div>
        <label htmlFor="banca" className="block text-sm font-medium text-gray-300">
          Banca *
        </label>
        <input
          type="text"
          id="banca"
          name="banca"
          value={formData.banca}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="Ex: CEBRASPE"
          required
        />
      </div>

      {/* Cargo */}
      <div>
        <label htmlFor="cargo" className="block text-sm font-medium text-gray-300">
          Cargo *
        </label>
        <input
          type="text"
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="Ex: Analista do Seguro Social"
          required
        />
      </div>

      {/* Salário */}
      <div>
        <label htmlFor="salario" className="block text-sm font-medium text-gray-300">
          Salário
        </label>
        <input
          type="text"
          id="salario"
          name="salario"
          value={formData.salario}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="Ex: R$ 2.500,00"
        />
      </div>

      {/* Data da Prova */}
      <div>
        <label htmlFor="dataProva" className="block text-sm font-medium text-gray-300">
          Data da Prova *
        </label>
        <input
          type="date"
          id="dataProva"
          name="dataProva"
          value={formData.dataProva}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          required
        />
      </div>

      {/* Data Final Inscrição */}
      <div>
        <label htmlFor="dataFinalInscricao" className="block text-sm font-medium text-gray-300">
          Data Final Inscrição *
        </label>
        <input
          type="date"
          id="dataFinalInscricao"
          name="dataFinalInscricao"
          value={formData.dataFinalInscricao}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          required
        />
      </div>

      {/* Data de Encerramento */}
      <div>
        <label htmlFor="dataEncerramento" className="block text-sm font-medium text-gray-300">
          Data de Encerramento *
        </label>
        <input
          type="date"
          id="dataEncerramento"
          name="dataEncerramento"
          value={formData.dataEncerramento}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          required
        />
      </div>

      {/* Edital */}
      <div>
        <label htmlFor="edital" className="block text-sm font-medium text-gray-300">
          URL do Edital
        </label>
        <input
          type="url"
          id="edital"
          name="edital"
          value={formData.edital}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="https://..."
        />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-300">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-100 placeholder-gray-500"
          placeholder="Detalhes adicionais sobre o concurso..."
          rows={4}
        />
      </div>

      {/* Erro */}
      {(submitError || error) && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded">
          {submitError || error}
        </div>
      )}

      {/* Sucesso */}
      {submitSuccess && (
        <div className="bg-green-900 bg-opacity-30 border border-green-700 text-green-300 px-4 py-3 rounded">
          Concurso adicionado com sucesso!
        </div>
      )}

      {/* Botão Enviar */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? 'Adicionando...' : 'Adicionar Concurso'}
      </button>
    </form>
  );
}
