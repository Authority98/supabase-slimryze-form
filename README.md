# SlimRyze Form System

A form management system built with Next.js and Supabase, featuring dynamic form creation, single/multiple choice questions, and email notifications.

## Features

- Dynamic form creation and management
- Single and multiple choice questions
- Question-by-question navigation with animations
- Progress tracking
- Email notifications using Sendinblue/Brevo
- Responsive design with dark theme
- Admin interface for form management

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Authority98/supabase-slimryze-form.git
   cd supabase-slimryze-form
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Fill in the required values:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `SENDINBLUE_API_KEY`: Your Sendinblue/Brevo API key

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses Supabase with the following tables:

- `forms`: Stores form metadata

  - `id`: UUID (primary key)
  - `title`: Text
  - `description`: Text
  - `permalink`: Text (unique)
  - `created_at`: Timestamp
  - `user_id`: UUID (foreign key to auth.users)

- `questions`: Stores form questions
  - `id`: UUID (primary key)
  - `form_id`: UUID (foreign key to forms)
  - `text`: Text
  - `subtitle`: Text
  - `type`: Text (enum: 'text', 'single_choice', 'multiple_choice')
  - `options`: JSON
  - `order`: Integer
  - `created_at`: Timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
