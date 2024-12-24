import { Box } from '@mui/material'
import { DataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid'
import { ReactNode } from 'react'

interface TableProps extends DataGridProps {
  children: ReactNode
}

export function Table({ children, ...rest }: TableProps) {
  return (
    <div className="bg-white rounded-md">
      {children}
      <Box sx={{ height: 420 }}>
        <DataGrid
          pagination
          rowHeight={52}
          autoPageSize
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            borderRadius: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F7F9FC',
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
          }}
          {...rest}
        />
      </Box>
    </div>
  )
}
