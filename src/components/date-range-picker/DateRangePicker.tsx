import { useRef, useState } from 'react';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from 'dayjs';

import CalendarMonth from './CalendarMonth';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type DateRangeValue = [Dayjs | null, Dayjs | null];

export interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'small' | 'medium';
  minDate?: Dayjs;
  maxDate?: Dayjs;
  /** Date format string (dayjs). Defaults to locale format via MUI X adapter. */
  format?: string;
  allowClear?: boolean;
  fullWidth?: boolean;
  /** Whether [startDate, endDate] can individually be null. Default: [false, false] */
  allowEmpty?: [boolean, boolean];
  invalid?: boolean;
  error?: string;
  sx?: SxProps<Theme>;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

function DateRangePicker({
  value = [null, null],
  onChange,
  label,
  disabled,
  readOnly,
  size = 'small',
  minDate,
  maxDate,
  format,
  allowClear = true,
  fullWidth = false,
  allowEmpty = [false, false],
  invalid,
  error,
  sx,
}: DateRangePickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);
  /** Guards against the DateField's onFocus re-opening the calendar immediately after close */
  const isClosingRef = useRef(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [leftMonth, setLeftMonth] = useState<Dayjs>(dayjs().startOf('month'));
  const [isSelecting, setIsSelecting] = useState(false);
  const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [focused, setFocused] = useState(false);

  const [startDate, endDate] = value;
  const open = Boolean(anchorEl);
  const rightMonth = leftMonth.add(1, 'month');

  /* ---------------------- Compute effective display range ------------------- */
  let effectiveStart: Dayjs | null = isSelecting ? pendingStart : startDate;
  let effectiveEnd: Dayjs | null = isSelecting ? null : endDate;

  if (isSelecting && pendingStart && hoverDate) {
    if (hoverDate.isBefore(pendingStart, 'day')) {
      effectiveStart = hoverDate;
      effectiveEnd = pendingStart;
    } else {
      effectiveStart = pendingStart;
      effectiveEnd = hoverDate;
    }
  }

  /* ----------------------------- Visual state ------------------------------ */
  const isActive = open || focused;
  const isDarkMode = theme.palette.mode === 'dark';

  const borderColor = disabled
    ? theme.palette.grey[isDarkMode ? 600 : 300]
    : isActive
      ? theme.palette.primary.main
      : invalid
        ? theme.palette.error.main
        : theme.palette.grey[isDarkMode ? 700 : 200];

  const hoverBorderColor = theme.palette.text.primary;

  const py = size === 'small' ? '12px' : '16.5px';
  const fontSize = size === 'small' ? '0.875rem' : '1rem';
  const inputHeight = size === 'small' ? 44 : 56;
  const staticWidth = size === 'small' ? 280 : 320;

  /* ----------------------------- Handlers ----------------------------------- */
  const openCalendar = () => {
    if (disabled || readOnly || isClosingRef.current || open) return;
    const month = startDate ? startDate.startOf('month') : dayjs().startOf('month');
    setLeftMonth(month);
    setIsSelecting(false);
    setPendingStart(null);
    setHoverDate(null);
    setAnchorEl(containerRef.current);
  };

  const handleClose = (skipPartialCommit = false) => {
    // Block onFocus from re-opening until the current event loop clears
    isClosingRef.current = true;
    setTimeout(() => {
      isClosingRef.current = false;
    }, 0);
    // If user dismissed without completing selection, commit start-only if allowEmpty[1]
    if (!skipPartialCommit && isSelecting && pendingStart && allowEmpty[1]) {
      onChange?.([pendingStart, null]);
    }
    setAnchorEl(null);
    setIsSelecting(false);
    setPendingStart(null);
    setHoverDate(null);
  };

  const handleDayClick = (day: Dayjs) => {
    if (!isSelecting) {
      setPendingStart(day.startOf('day'));
      setIsSelecting(true);
      setHoverDate(null);
    } else {
      if (pendingStart) {
        const [s, e] = day.isBefore(pendingStart, 'day')
          ? [day.startOf('day'), pendingStart.endOf('day')]
          : [pendingStart.startOf('day'), day.endOf('day')];
        onChange?.([s, e]);
      }
      setIsSelecting(false);
      setPendingStart(null);
      setHoverDate(null);
      handleClose(true); // range already committed above, skip partial-commit logic
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([null, null]);
  };

  const handleClearStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([null, endDate]);
  };

  const handleClearEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([startDate, null]);
  };

  /* -------------------- Shared DateField slot props ----------------------- */
  const fieldSlotProps = () => ({
    textField: {
      variant: 'standard' as const,
      onFocus: () => {
        setFocused(true);
        openCalendar();
      },
      onBlur: () => setFocused(false),
      InputProps: {
        disableUnderline: true,
        sx: {
          fontSize,
          '& .MuiInputBase-input': { p: 0, cursor: readOnly || disabled ? 'default' : 'text' },
        },
      },
      sx: { flex: 1, minWidth: 0, '& .MuiInputBase-root': { p: 0 } },
    },
  });

  /* ----------------------------- Calendar UI -------------------------------- */
  const calendarContent = (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={isMobile ? 2 : 3}
      sx={{ p: 2.5 }}
      onMouseLeave={() => setHoverDate(null)}
    >
      <CalendarMonth
        month={leftMonth}
        effectiveStart={effectiveStart}
        effectiveEnd={effectiveEnd}
        minDate={minDate}
        maxDate={maxDate}
        showPrev
        showNext={isMobile}
        fullWidth={isMobile}
        onPrev={() => setLeftMonth((m) => m.subtract(1, 'month'))}
        onNext={() => setLeftMonth((m) => m.add(1, 'month'))}
        onDayClick={handleDayClick}
        onDayHover={setHoverDate}
      />
      {!isMobile && (
        <>
          <Divider orientation="vertical" flexItem />
          <CalendarMonth
            month={rightMonth}
            effectiveStart={effectiveStart}
            effectiveEnd={effectiveEnd}
            minDate={minDate}
            maxDate={maxDate}
            showPrev={false}
            showNext
            onPrev={() => setLeftMonth((m) => m.subtract(1, 'month'))}
            onNext={() => setLeftMonth((m) => m.add(1, 'month'))}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
          />
        </>
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        width: fullWidth ? '100%' : staticWidth,
        ...sx,
      }}
    >
      {/* ── Floating label ── */}
      {label && (
        <Box
          component="label"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'none',
            transformOrigin: 'top left',
            transform: 'translate(12px, -9px) scale(0.75)',
            transition: 'transform 0.15s cubic-bezier(0,0,0.2,1), color 0.15s',
            color: isActive ? 'primary.main' : invalid ? 'error.main' : 'text.secondary',
            fontSize: '1rem',
            lineHeight: '1.4375em',
            bgcolor: 'background.paper',
            px: 0.5,
          }}
        >
          {label}
        </Box>
      )}

      {/* ── Compound input container ── */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py,
          height: inputHeight,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          boxShadow: isActive ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
          backgroundColor: disabled ? theme.palette.action.disabledBackground : undefined,
          transition: 'border-color 0.2s, box-shadow 0.15s',
          '&:hover': !disabled && !isActive ? { borderColor: hoverBorderColor } : {},
        }}
      >
        {/* Start date field */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <DateField
            value={startDate}
            onChange={(d) => onChange?.([d ? d.startOf('day') : d, endDate])}
            format={format}
            readOnly={readOnly}
            disabled={disabled}
            minDate={minDate}
            maxDate={endDate ?? maxDate}
            slotProps={fieldSlotProps()}
          />
          {allowEmpty[0] && !disabled && !readOnly && (
            <IconButton
              size="small"
              onClick={handleClearStart}
              sx={{ p: '2px', flexShrink: 0, visibility: startDate ? 'visible' : 'hidden' }}
            >
              <ClearIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>

        {/* Separator */}
        <ArrowRightAltIcon
          fontSize="small"
          sx={{ color: 'text.secondary', flexShrink: 0, mx: 0.25 }}
        />

        {/* End date field */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <DateField
            value={endDate}
            onChange={(d) => onChange?.([startDate, d ? d.endOf('day') : d])}
            format={format}
            readOnly={readOnly}
            disabled={disabled}
            minDate={startDate ?? minDate}
            maxDate={maxDate}
            slotProps={fieldSlotProps()}
          />
          {allowEmpty[1] && !disabled && !readOnly && (
            <IconButton
              size="small"
              onClick={handleClearEnd}
              sx={{ p: '2px', flexShrink: 0, visibility: endDate ? 'visible' : 'hidden' }}
            >
              <ClearIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>

        {/* Global clear button – always rendered to prevent layout shift */}
        {allowClear && !allowEmpty[0] && !allowEmpty[1] && !disabled && !readOnly && (
          <IconButton
            size="small"
            onClick={handleClearAll}
            edge="end"
            sx={{
              flexShrink: 0,
              ml: 0.25,
              visibility: startDate || endDate ? 'visible' : 'hidden',
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Error helper text */}
      {error && (
        <FormHelperText error sx={{ mx: 1.75, mt: 0.375 }}>
          {error}
        </FormHelperText>
      )}

      {/* ── Desktop: Popover ── */}
      {!isMobile && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => handleClose()}
          disableEnforceFocus
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { mt: 0.5 } } }}
        >
          {calendarContent}
        </Popover>
      )}

      {/* ── Mobile: Dialog ── */}
      {isMobile && (
        <Dialog
          open={open}
          onClose={() => handleClose()}
          maxWidth="xs"
          PaperProps={{ sx: { m: 2, width: 'calc(100% - 32px)' } }}
        >
          {calendarContent}
        </Dialog>
      )}
    </Box>
  );
}

export default DateRangePicker;
