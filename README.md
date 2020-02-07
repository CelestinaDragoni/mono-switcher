
# MonoSwitcher
Desktop Application That Controls the Monoprice HDMI 8-Port Switch via Serial

## Requirements
1. You need an 8-port Monoprice HDMI Switch: https://www.amazon.com/gp/product/B003L14X3A
2. You need an RS232 to USB Cable (FTDI Chipset Recommended): https://www.amazon.com/gp/product/B0762BTX7T
3. Windows, Mac, Linux (64-Bit, x86 Only)
4. (Linux Only) Ensure you have serial communication at a kernel level (very likely) and give your user permission to access serial by adding the appropriate user group. This is different for each distribution, use Google, I believe in you.

## Package Downloads
### Linux (v1.0.0)
**Portable Package (tar.gz)**: [Download](http://kernelzechs.com/downloads/mono-tracker/linux/MonoSwitcher-1.0.0.tar.gz)

**Debian Package**: [Download](http://kernelzechs.com/downloads/mono-tracker/linux/MonoSwitcher-1.0.0.deb)

**AppImage Package**: [Download](http://kernelzechs.com/downloads/mono-tracker/linux/MonoSwitcher-1.0.0.AppImage)

### Windows (v1.0.0)
**Portable Package (zip)**: Download

**Installer Package**: Download

### macOS (v1.0.0)
**Portable Package (dmg)**: Download

## Support
I sorta did this for funsies and I'm not really looking to support it because I already have enough on my plate. However if something is critically wrong, feel free to add a ticket in GitHub. Feature requests will be rejected as it does what it needs to do at a fundamental level.

## Background Service Application
What you're looking for is my sister's work which can be found here: [https://github.com/NicholeMattera/MonopriceSwitcherService](https://github.com/NicholeMattera/MonopriceSwitcherService)

## Credits
This wouldn't have been possible without the serial communication documentation provided by the dudeguy on the Amazon comments for the product. Information on their documentation can be found here.

## Development
### Knowledge Prerequisites 
To effectively work on this project you need to know the following:

 - General javascript knowledge (and no, not jQuery)
 - Knowledge of React and how React context works.
 - If you plan to make any build modifications, a very good understanding of webpack.
 - SASS for stylesheeting.
 - How serial communication works, and the hell that is node SerialPort (seriously, it sucks)

### Software Dependencies
For general development you must have:
 - Node LTS Version 12 or above
 - Yarn
 - A coder such as Vim, Sublime Text, or Visual Studio Code
 - Python 2 (For Electron Builder)

For building binaries
 - The above dependencies installed and ...
 - Python 2.x
 - Compiler
     - Windows:
         - Visual Studio (Express)
    - macOS:
        - XCode with Command Line Tools
    - Linux:
        - GCC or CLANG/LLVM

### Getting Started With Development 

 - Clone this repo
 - Run: `yarn install`
 - Run: `yarn electron-rebuild`
 - Run: `yarn start`

All application files are in the `src/` folder and is organized accordingly. The root of the application starts at `index.js`.

### Building an Electron Binary
- Run `yarn bundle`

All artifacts will be built into the `./dist` folder. You will need each environment to build binaries for Windows, Linux, and macOS.
