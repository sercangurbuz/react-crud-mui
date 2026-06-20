import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';

import { buildCalendarDays } from './utils';

interface CalendarProps {
  month: Dayjs;
  effectiveStart: Dayjs | null;
  effectiveEnd: Dayjs | null;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  showPrev: boolean;
  showNext: boolean;
  fullWidth?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDayClick: (day: Dayjs) => void;
  onDayHover: (day: Dayjs | null) => void;
}

function CalendarMonth({
  month,
  effectiveStart,
  effectiveEnd,
  minDate,
  maxDate,
  showPrev,
  showNext,
  fullWidth,
  onPrev,
  onNext,
  onDayClick,
  onDayHover,
}: CalendarProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const today = dayjs();
  const days = buildCalendarDays(month);
  const weekDays = Array.from({ length: 7 }, (_, i) => dayjs().day(i).format('dd'));

  const isSameDayRange =
    !!effectiveStart && !!effectiveEnd && effectiveStart.isSame(effectiveEnd, 'day');

  return (
    <Box sx={{ width: fullWidth ? '100%' : 252, userSelect: 'none' }}>
      {/* Month header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <IconButton
          size="small"
          onClick={onPrev}
          sx={{ visibility: showPrev ? 'visible' : 'hidden' }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" fontWeight={600}>
          {month.format('MMMM YYYY')}
        </Typography>
        <IconButton
          size="small"
          onClick={onNext}
          sx={{ visibility: showNext ? 'visible' : 'hidden' }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Week day headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {weekDays.map((d) => (
          <Box key={d} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Day cells */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days.map((day, i) => {
          if (!day) return <Box key={`empty-${i}`} sx={{ height: 36 }} />;

          const isStart = !!effectiveStart && day.isSame(effectiveStart, 'day');
          const isEnd = !!effectiveEnd && day.isSame(effectiveEnd, 'day');
          const isInRange =
            !!effectiveStart &&
            !!effectiveEnd &&
            !isSameDayRange &&
            day.isAfter(effectiveStart, 'day') &&
            day.isBefore(effectiveEnd, 'day');
          const isToday = day.isSame(today, 'day');
          const isDisabled =
            (!!minDate && day.isBefore(minDate, 'day')) ||
            (!!maxDate && day.isAfter(maxDate, 'day'));

          // Range strip: left half for end/in-range, right half for start/in-range
          const showStripLeft = (isInRange || isEnd) && !isSameDayRange;
          const showStripRight = (isInRange || isStart) && !isSameDayRange;
          const isEdge = isStart || isEnd;

          return (
            <Box
              key={day.valueOf()}
              sx={{
                position: 'relative',
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={() => !isDisabled && onDayHover(day)}
              onMouseLeave={() => onDayHover(null)}
            >
              {/* Left strip for in-range / end date */}
              {showStripLeft && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: '50%',
                    top: 4,
                    bottom: 4,
                    bgcolor: alpha(primary, 0.15),
                    pointerEvents: 'none',
                  }}
                />
              )}
              {/* Right strip for in-range / start date */}
              {showStripRight && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    right: 0,
                    top: 4,
                    bottom: 4,
                    bgcolor: alpha(primary, 0.15),
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Day button (circle) */}
              <ButtonBase
                onClick={() => !isDisabled && onDayClick(day)}
                disabled={isDisabled}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  fontSize: '0.875rem',
                  fontWeight: isEdge ? 600 : 400,
                  bgcolor: isEdge ? primary : 'transparent',
                  color: isEdge
                    ? theme.palette.primary.contrastText
                    : isToday
                      ? primary
                      : 'text.primary',
                  outline: isToday && !isEdge ? `1px solid ${primary}` : 'none',
                  transition: 'background-color 0.15s',
                  '&:hover': {
                    bgcolor: isEdge ? primary : alpha(primary, 0.25),
                  },
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                {day.date()}
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default CalendarMonth;
