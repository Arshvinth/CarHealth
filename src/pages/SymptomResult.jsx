import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, RefreshCw, PlusCircle } from 'lucide-react';
import DiagnosticReport from '../components/DiagnosticReport';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  LoadingSkeleton,
  EmptyState,
  Modal,
  PageTransition,
} from '../components/ui';
import { analyzeVehicleSymptoms } from '../services/aiService';
import {
  deleteSymptomReport,
  getSymptomReportById,
  saveSymptomReport,
  updateSymptomReport,
} from '../services/symptomService';
import { downloadDiagnosticPdf } from '../utils/pdfReport';

export default function SymptomResult() {
  const { reportId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [record, setRecord] = useState(() => location.state?.liveResult || null);
  const [loading, setLoading] = useState(Boolean(reportId && !location.state?.liveResult));
  const [isSaved, setIsSaved] = useState(Boolean(reportId));
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    let active = true;
    getSymptomReportById(reportId).then((found) => {
      if (!active) return;
      if (found) {
        setRecord(found);
        setIsSaved(true);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [reportId]);

  const handleSave = async () => {
    if (!record || isSaving) return;
    setIsSaving(true);
    try {
      const { report: saved } = await saveSymptomReport({
        vehicleId: record.vehicleId || record.vehicleDetails?.vehicleId || null,
        vehicleType: record.vehicleType,
        vehicleDetails: record.vehicleDetails,
        symptomDescription: record.symptomDescription,
        additionalSelections: record.additionalSelections,
        aiReport: record.aiReport,
        severity: record.aiReport?.severityAssessment?.level,
        provider: record.provider,
        model: record.model,
      });
      setRecord(saved);
      setIsSaved(true);
      navigate(`/symptom-checker/result/${saved.id}`, { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateWithAnswers = async (newAnswers) => {
    if (!record || isRegenerating) return;
    setRegenError(null);
    setIsRegenerating(true);

    const combinedAnswers = [
      ...(record.additionalSelections?.followUpAnswers || []),
      ...newAnswers,
    ];

    try {
      const response = await analyzeVehicleSymptoms({
        vehicleType: record.vehicleType,
        vehicleDetails: record.vehicleDetails || {},
        description: record.symptomDescription,
        whenOccurs: record.additionalSelections?.whenOccurs || [],
        whereOccurs: record.additionalSelections?.whereOccurs || [],
        symptomTypes: record.additionalSelections?.symptomTypes || [],
        frequency: record.additionalSelections?.frequency || '',
        followUpAnswers: combinedAnswers,
      });

      const updatedSelections = {
        ...(record.additionalSelections || {}),
        followUpAnswers: combinedAnswers,
      };

      const nextRecord = {
        ...record,
        additionalSelections: updatedSelections,
        aiReport: response.report,
        severity: response.report.severityAssessment?.level,
        provider: response.provider,
        model: response.model,
      };

      if (isSaved && record.id) {
        const persisted = await updateSymptomReport(record.id, {
          aiReport: response.report,
          severity: response.report.severityAssessment?.level,
          additionalSelections: updatedSelections,
        });
        setRecord(persisted || nextRecord);
      } else {
        setRecord(nextRecord);
      }
    } catch (err) {
      setRegenError(
        err?.message || 'Unable to regenerate the diagnostic assessment while AI is unavailable.'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleUpdateNotes = async (notesText) => {
    if (!record?.id) return;
    const updated = await updateSymptomReport(record.id, { notes: notesText });
    if (updated) setRecord(updated);
  };

  const handleToggleResolved = async () => {
    if (!record?.id) return;
    const nextStatus = record.status === 'Resolved' ? 'Open' : 'Resolved';
    const updated = await updateSymptomReport(record.id, { status: nextStatus });
    if (updated) setRecord(updated);
  };

  const handleConfirmDelete = async () => {
    if (!record?.id) return;
    await deleteSymptomReport(record.id);
    setDeleteModalOpen(false);
    navigate('/history');
  };

  const handleDownloadPdf = () => {
    if (!record) return;
    downloadDiagnosticPdf({
      reportId: record.id || 'LIVE-ASSESSMENT',
      diagnosisDate: record.diagnosisDate,
      vehicleType: record.vehicleType,
      vehicleDetails: record.vehicleDetails,
      symptomDescription: record.symptomDescription,
      additionalSelections: record.additionalSelections,
      aiReport: record.aiReport,
      notes: record.notes,
      status: record.status || 'Open',
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <LoadingSkeleton variant="stat" count={2} />
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </PageTransition>
    );
  }

  if (!record || !record.aiReport) {
    return (
      <PageTransition>
        <PageHeader
          title="Diagnostic Report Not Found"
          breadcrumbs={[
            { label: 'CarHealth', to: '/' },
            { label: 'Symptom Checker', to: '/symptom-checker' },
            { label: 'Report' },
          ]}
        />
        <EmptyState
          title="No active diagnostic report to display"
          description="Submit a vehicle symptom description in the Symptom Checker or reopen a saved report from Diagnostic History."
          action={
            <PrimaryButton icon={PlusCircle} onClick={() => navigate('/symptom-checker')}>
              Start New Symptom Check
            </PrimaryButton>
          }
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader
        title="AI Symptom Diagnostic Report"
        description="Structured initial engineering assessment based on your vehicle powertrain and reported symptoms."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Symptom Checker', to: '/symptom-checker' },
          { label: record.id || 'Live Result' },
        ]}
        actions={
          <>
            <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/symptom-checker')}>
              New Symptom Check
            </SecondaryButton>
          </>
        }
      />

      {regenError && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-400" />
            <span>{regenError}</span>
          </div>
          <button
            type="button"
            onClick={() => setRegenError(null)}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-white hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Dismiss
          </button>
        </div>
      )}

      <DiagnosticReport
        report={record.aiReport}
        vehicleType={record.vehicleType}
        vehicleDetails={record.vehicleDetails}
        symptomDescription={record.symptomDescription}
        additionalSelections={record.additionalSelections}
        reportId={record.id}
        status={record.status || 'Open'}
        notes={record.notes || ''}
        isSaved={isSaved}
        isSaving={isSaving}
        isRegenerating={isRegenerating}
        onSave={handleSave}
        onDownloadPdf={handleDownloadPdf}
        onRegenerateWithAnswers={handleRegenerateWithAnswers}
        onUpdateNotes={handleUpdateNotes}
        onToggleResolved={handleToggleResolved}
        onDelete={() => setDeleteModalOpen(true)}
      />

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Diagnostic Report?"
        subtitle="This will permanently remove this symptom assessment from your diagnostic history."
        footer={
          <>
            <SecondaryButton onClick={() => setDeleteModalOpen(false)}>Cancel</SecondaryButton>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="cursor-pointer rounded-xl border border-red-500/50 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
            >
              Delete Report
            </button>
          </>
        }
      >
        <p className="text-sm text-[#94A3B8]">
          Are you sure you want to delete report{' '}
          <span className="font-mono font-semibold text-white">{record.id}</span>? You can download
          a PDF copy first if you want to keep an offline record.
        </p>
      </Modal>
    </PageTransition>
  );
}
