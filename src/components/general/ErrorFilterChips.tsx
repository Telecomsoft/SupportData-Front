import { Box, Chip } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MemoryIcon from '@mui/icons-material/Memory';
import CodeIcon from '@mui/icons-material/Code';

const filterTabs = [
  { id: 'total', label: 'تمام خطاها', icon: <ReportProblemIcon /> },
  { id: 'hardware', label: 'خطاهای سخت افزاری', icon: <MemoryIcon /> },
  { id: 'software', label: 'خطاهای نرم افزاری', icon: <CodeIcon /> },
];

export const ErrorFilterChips = ({ activeTab, onTabChange }) => {

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 1,

        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 1.5,
          px: 2,
          width: 'max-content',
          minWidth: '100%',
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Chip
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              clickable
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              onClick={() => onTabChange(tab.id)}
              sx={{
                flexShrink: 0,
                px: 1,
                py: 2.5,
                borderRadius: 20,
                fontSize: '12px',
                fontWeight: isActive ? 700 : 400,
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};