# UC018 — User Flow Diagram

```mermaid
flowchart TD
    Start([User Visits Site]) --> Landing[Landing Page]
    Landing --> ClickRegister{Clicks Register}
    ClickRegister --> RegForm[Registration Form Displayed]

    RegForm --> EnterName[Enter Name]
    EnterName --> EnterEmail[Enter Email]
    EnterEmail --> EnterPassword[Enter Password]
    EnterPassword --> EnterConfirm[Enter Confirm Password]
    EnterConfirm --> ClickSubmit[Click Register Button]

    ClickSubmit --> ClientValidation{Client-Side<br/>Validation}

    ClientValidation -->|Invalid| ShowClientError[Show Validation Errors]
    ShowClientError --> EnterName

    ClientValidation -->|Valid| SendToServer[Send Registration Request<br/>POST /api/auth/register]

    SendToServer --> ServerValidation{Server-Side<br/>Validation}

    ServerValidation -->|Email Already Exists| EmailError[Show: Email already registered]
    EmailError --> EnterEmail

    ServerValidation -->|Password Too Weak| PasswordError[Show: Password requirements not met]
    PasswordError --> EnterPassword

    ServerValidation -->|Passwords Don't Match| MatchError[Show: Passwords do not match]
    MatchError --> EnterConfirm

    ServerValidation -->|Valid| HashPassword[Hash Password with bcrypt]

    HashPassword --> CreateUser[Create User Record<br/>Role: RegisteredUser]

    CreateUser --> CreateSession[Create Auth Session]

    CreateSession --> Success{Success?}

    Success -->|Yes| Redirect[Redirect to /dashboard]
    Redirect --> ShowSuccess[Show Success Message:<br/>Account created successfully!]
    ShowSuccess --> Dashboard[User Dashboard]

    Success -->|No - DB Error| DBError[Show: Registration failed.<br/>Please try again]
    DBError --> RegForm

    Dashboard --> End([End])

    style RegForm fill:#e1f5ff
    style Success fill:#d4edda
    style EmailError fill:#f8d7da
    style PasswordError fill:#f8d7da
    style MatchError fill:#f8d7da
    style DBError fill:#f8d7da
    style Dashboard fill:#d4edda
```

## User Journey Summary

1. **Entry Point**: User clicks "Register" from navigation or landing page
2. **Input Phase**: User fills out 4-field form (name, email, password, confirm)
3. **Validation Phase**: Client-side validation provides immediate feedback
4. **Submission Phase**: Server validates and checks for existing email
5. **Creation Phase**: Password hashed, user record created, session established
6. **Success Phase**: Redirect to dashboard with welcome message
7. **Error Handling**: Clear, specific errors guide user to fix issues

## Key Decision Points

- **Client Validation**: Catches obvious errors before server request
- **Email Uniqueness Check**: Prevents duplicate accounts
- **Password Strength**: Enforces security requirements
- **Auto-Login**: Creates session immediately after registration

## Exit Points

- **Success**: User lands on dashboard as authenticated RegisteredUser
- **Errors**: User remains on form with guidance to correct issues
