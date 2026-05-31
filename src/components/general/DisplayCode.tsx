import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { sizeConverter } from '@src/utility/sizeConverter'

const highlightSyntax = (json: string) => {
    const replacer = (match: string, _p1: string, _p2: string, p3: string) => {
        let color = ''

        if (p3 === ':') {
            color = '#fff'
        } else if (/^"/.test(match)) {
            // String values
            color = '#98c379'
        } else if (/true|false/.test(match)) {
            // Boolean values
            color = '#56b6c2'
        } else if (/null/.test(match)) {
            // Null values
            color = '#e06c75'
        } else if (/[0-9]/.test(match)) {
            // Numbers
            color = '#d19a66'
        }

        return `<span style="color:${color};">${match}</span>`
    }

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\d+)/g, replacer)
}

type DisplayCodeProps = {
    data: Record<string, any>
    height?: number
}

const DisplayCode: React.FC<DisplayCodeProps> = ({ data,height }) => {
    const formattedJson = JSON.stringify(data, null, 2)

    return (
        <Paper
            elevation={3}
            sx={{
                backgroundColor: 'bgColor.2',
                borderRadius: sizeConverter(8, 'radius'),
                p: sizeConverter(10, 'space'),
                maxWidth: '100%',
                overflowX: 'auto',
                mt: sizeConverter(10, 'space'),
                width: '100%',
                boxShadow:0
            }}
        >
            <Typography variant="normalHeader" gutterBottom>
                نمایش اطلاعات
            </Typography>
            <Box
                dir="ltr"
                component="pre"
                sx={{
                    backgroundColor: 'black.1',
                    color: 'secondary.main',
                    borderRadius: sizeConverter(4, 'radius'),
                    p: sizeConverter(10, 'space'),
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    maxHeight: height ? height : '300px',
                    overflowY: 'auto',
                }}
                dangerouslySetInnerHTML={{ __html: highlightSyntax(formattedJson) }}
            />
        </Paper>
    )
}

export default DisplayCode
