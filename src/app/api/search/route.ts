// API route for searching the web for design examples
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // In a production app, this would use a real search API
    // For demo purposes, we'll return mock data
    const mockResults = {
      items: [
        {
          title: 'Creative ' + query + ' Design Example 1',
          link: 'https://example.com/design1',
          snippet: 'A beautiful design example that matches your query.'
        },
        {
          title: 'Inspirational ' + query + ' Design Reference',
          link: 'https://example.com/design2',
          snippet: 'Check out this inspirational design reference.'
        },
        {
          title: 'Professional ' + query + ' Design Sample',
          link: 'https://example.com/design3',
          snippet: 'A professional design sample that aligns with your needs.'
        },
        {
          title: 'Modern ' + query + ' Design Inspiration',
          link: 'https://example.com/design4',
          snippet: 'Get inspired by this modern design approach.'
        },
        {
          title: 'Trending ' + query + ' Design Ideas',
          link: 'https://example.com/design5',
          snippet: 'Explore the latest trending design ideas for your project.'
        }
      ]
    };

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
