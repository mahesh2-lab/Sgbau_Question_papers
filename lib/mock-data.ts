// Enhanced mock data with nested structure
export const mockFileSystem = {
  '/': {
    folders: [
      { id: 1, name: 'Documents', itemCount: 25, path: '/Documents' },
      { id: 2, name: 'Research Papers', itemCount: 18, path: '/Research Papers' },
      { id: 3, name: 'Presentations', itemCount: 12, path: '/Presentations' },
      { id: 4, name: 'Archive', itemCount: 45, path: '/Archive' },
      { id: 5, name: 'Personal', itemCount: 8, path: '/Personal' },
      { id: 6, name: 'Work Projects', itemCount: 32, path: '/Work Projects' }
    ],
    files: [
      { id: 1, name: 'Quick Reference.pdf', size: '1.2 MB', modified: '1 day ago' },
      { id: 2, name: 'Getting Started Guide.pdf', size: '3.4 MB', modified: '3 days ago' },
      { id: 3, name: 'System Overview.pdf', size: '2.1 MB', modified: '1 week ago' }
    ]
  },
  '/Documents': {
    folders: [
      { id: 7, name: 'Contracts', itemCount: 8, path: '/Documents/Contracts' },
      { id: 8, name: 'Reports', itemCount: 12, path: '/Documents/Reports' },
      { id: 9, name: 'Templates', itemCount: 5, path: '/Documents/Templates' }
    ],
    files: [
      { id: 4, name: 'Annual Report 2024.pdf', size: '2.4 MB', modified: '2 days ago' },
      { id: 5, name: 'Project Proposal.pdf', size: '1.8 MB', modified: '1 week ago' },
      { id: 6, name: 'Meeting Notes.pdf', size: '856 KB', modified: '3 days ago' },
      { id: 7, name: 'Budget Analysis.pdf', size: '3.2 MB', modified: '5 days ago' }
    ]
  },
  '/Documents/Contracts': {
    folders: [
      { id: 10, name: '2024', itemCount: 4, path: '/Documents/Contracts/2024' },
      { id: 11, name: '2023', itemCount: 3, path: '/Documents/Contracts/2023' }
    ],
    files: [
      { id: 8, name: 'Service Agreement.pdf', size: '1.5 MB', modified: '1 week ago' },
      { id: 9, name: 'NDA Template.pdf', size: '892 KB', modified: '2 weeks ago' }
    ]
  },
  '/Documents/Contracts/2024': {
    folders: [],
    files: [
      { id: 10, name: 'Q1 Contract.pdf', size: '2.1 MB', modified: '2 months ago' },
      { id: 11, name: 'Q2 Contract.pdf', size: '1.9 MB', modified: '1 month ago' },
      { id: 12, name: 'Vendor Agreement.pdf', size: '1.3 MB', modified: '3 weeks ago' },
      { id: 13, name: 'Partnership Deal.pdf', size: '2.8 MB', modified: '1 week ago' }
    ]
  },
  '/Documents/Reports': {
    folders: [
      { id: 12, name: 'Monthly', itemCount: 6, path: '/Documents/Reports/Monthly' },
      { id: 13, name: 'Quarterly', itemCount: 4, path: '/Documents/Reports/Quarterly' }
    ],
    files: [
      { id: 14, name: 'Performance Review.pdf', size: '3.1 MB', modified: '1 week ago' },
      { id: 15, name: 'Market Analysis.pdf', size: '4.2 MB', modified: '2 weeks ago' }
    ]
  },
  '/Research Papers': {
    folders: [
      { id: 14, name: 'AI & Machine Learning', itemCount: 8, path: '/Research Papers/AI & Machine Learning' },
      { id: 15, name: 'Data Science', itemCount: 6, path: '/Research Papers/Data Science' },
      { id: 16, name: 'Computer Vision', itemCount: 4, path: '/Research Papers/Computer Vision' }
    ],
    files: [
      { id: 16, name: 'Deep Learning Fundamentals.pdf', size: '5.2 MB', modified: '1 week ago' },
      { id: 17, name: 'Neural Networks Overview.pdf', size: '3.8 MB', modified: '2 weeks ago' },
      { id: 18, name: 'Research Methodology.pdf', size: '2.1 MB', modified: '3 weeks ago' }
    ]
  },
  '/Research Papers/AI & Machine Learning': {
    folders: [],
    files: [
      { id: 19, name: 'Transformer Architecture.pdf', size: '4.1 MB', modified: '1 week ago' },
      { id: 20, name: 'GPT Models Explained.pdf', size: '3.5 MB', modified: '2 weeks ago' },
      { id: 21, name: 'Attention Mechanisms.pdf', size: '2.8 MB', modified: '3 weeks ago' },
      { id: 22, name: 'BERT and Beyond.pdf', size: '3.2 MB', modified: '1 month ago' },
      { id: 23, name: 'Computer Vision with CNNs.pdf', size: '4.8 MB', modified: '1 month ago' }
    ]
  },
  '/Presentations': {
    folders: [
      { id: 17, name: 'Client Meetings', itemCount: 5, path: '/Presentations/Client Meetings' },
      { id: 18, name: 'Team Updates', itemCount: 7, path: '/Presentations/Team Updates' }
    ],
    files: [
      { id: 24, name: 'Company Overview.pdf', size: '8.1 MB', modified: '3 days ago' },
      { id: 25, name: 'Product Demo.pdf', size: '12.3 MB', modified: '1 week ago' },
      { id: 26, name: 'Sales Pitch.pdf', size: '6.7 MB', modified: '2 weeks ago' }
    ]
  },
  '/Archive': {
    folders: [
      { id: 19, name: '2023', itemCount: 15, path: '/Archive/2023' },
      { id: 20, name: '2022', itemCount: 18, path: '/Archive/2022' },
      { id: 21, name: '2021', itemCount: 12, path: '/Archive/2021' }
    ],
    files: [
      { id: 27, name: 'Legacy System Docs.pdf', size: '15.2 MB', modified: '6 months ago' },
      { id: 28, name: 'Old Contracts.pdf', size: '8.9 MB', modified: '8 months ago' }
    ]
  },
  '/Personal': {
    folders: [
      { id: 22, name: 'Certificates', itemCount: 3, path: '/Personal/Certificates' },
      { id: 23, name: 'Travel', itemCount: 5, path: '/Personal/Travel' }
    ],
    files: [
      { id: 29, name: 'Resume.pdf', size: '1.1 MB', modified: '1 month ago' },
      { id: 30, name: 'Portfolio.pdf', size: '8.5 MB', modified: '2 months ago' }
    ]
  },
  '/Work Projects': {
    folders: [
      { id: 24, name: 'Project Alpha', itemCount: 8, path: '/Work Projects/Project Alpha' },
      { id: 25, name: 'Project Beta', itemCount: 12, path: '/Work Projects/Project Beta' },
      { id: 26, name: 'Project Gamma', itemCount: 6, path: '/Work Projects/Project Gamma' }
    ],
    files: [
      { id: 31, name: 'Project Guidelines.pdf', size: '2.3 MB', modified: '1 week ago' },
      { id: 32, name: 'Team Structure.pdf', size: '1.8 MB', modified: '2 weeks ago' }
    ]
  }
}
