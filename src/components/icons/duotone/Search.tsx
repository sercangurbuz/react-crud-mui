import { SvgIcon, SvgIconProps } from '@mui/material'

const Search = (props: SvgIconProps) => {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        // opacity="0.4"
        d="M15.5155 13.7744L11.8333 10.0921C11.3709 10.7781 10.7793 11.37 10.093 11.8323L13.7753 15.5146C14.2558 15.9951 15.035 15.9951 15.5155 15.5146C15.9954 15.0356 15.9954 14.2543 15.5155 13.7744Z"
        // fill=""
        className="secondary"
      />
      <path
        d="M6.4957 0.125C2.98938 0.125 0.124756 2.98992 0.124756 6.52363C0.124756 10.0573 2.98938 12.9223 6.4957 12.9223C10.002 12.9223 12.8943 10.0573 12.8943 6.52363C12.8943 2.98992 10.058 0.125 6.4957 0.125ZM6.4957 10.4612C4.32448 10.4612 2.55809 8.69485 2.55809 6.52363C2.55809 4.3524 4.32448 2.58601 6.4957 2.58601C8.66693 2.58601 10.4333 4.3524 10.4333 6.52363C10.4333 8.69547 8.69523 10.4612 6.4957 10.4612Z"
        // fill="#64748B"
      />
    </SvgIcon>
  )
}

export default Search
